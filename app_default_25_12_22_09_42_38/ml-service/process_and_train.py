import argparse
import pandas as pd
import numpy as np
from sklearn.decomposition import TruncatedSVD
from sklearn.neighbors import NearestNeighbors
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.compose import ColumnTransformer
import joblib
import os

def normalize_gender(v):
    if pd.isna(v): return None
    s = str(v).strip().lower()
    if s in ('male','m','man','homme','h','masculin'): return 'male'
    if s in ('female','f','woman','femme','f','feminin'): return 'female'
    return None

def build_table(df):
    df['gender_norm'] = df['gender'].apply(normalize_gender)
    # consider these interaction types for features; purchases still included
    interactions = df[df['interaction_type'].str.lower().isin(['purchase','like','add to cart','add_to_cart','add-to-cart'])].copy()
    purchases = df[df['interaction_type'].str.lower() == 'purchase'].copy()

    # product metadata from full dataset (not only purchases)
    meta = df.groupby('article_id').agg(
        prod_name = ('prod_name','first'),
        product_type_name = ('product_type_name','first'),
        product_group_name = ('product_group_name','first')
    ).reset_index()

    # interaction counts per article (total interactions & gender split)
    inter_counts = interactions.groupby('article_id').agg(
        total_interactions = ('customer_id','count'),
        male_interactions = ('gender_norm', lambda x: (x=='male').sum()),
        female_interactions = ('gender_norm', lambda x: (x=='female').sum())
    ).reset_index()

    # counts per interaction type (canonicalized)
    counts = interactions.groupby(['article_id','interaction_type']).size().unstack(fill_value=0).reset_index()
    for col in ['purchase','like','add to cart','add_to_cart','add-to-cart']:
        if col not in counts.columns:
            counts[col] = 0
    counts['purchase_count'] = counts.get('purchase',0)
    counts['like_count'] = counts.get('like',0)
    counts['cart_count'] = counts.get('add to cart',0) + counts.get('add_to_cart',0) + counts.get('add-to-cart',0)
    counts = counts[['article_id','purchase_count','like_count','cart_count']]

    # purchases-specific aggregates (to keep previous info)
    agg_purch = purchases.groupby('article_id').agg(
        total_purchases = ('customer_id','count'),
        male_purchases = ('gender_norm', lambda x: (x=='male').sum()),
        female_purchases = ('gender_norm', lambda x: (x=='female').sum())
    ).reset_index()

    # merge meta + interaction counts + per-type counts + purchase aggregates
    merged = meta.merge(inter_counts, on='article_id', how='left') \
                 .merge(counts, on='article_id', how='left') \
                 .merge(agg_purch, on='article_id', how='left') \
                 .fillna({'total_interactions':0,'male_interactions':0,'female_interactions':0,'purchase_count':0,'like_count':0,'cart_count':0,'total_purchases':0,'male_purchases':0,'female_purchases':0})

    # target gender rule based on all interactions (purchase + like + cart)
    # avoid division by zero
    merged['male_pct'] = merged.apply(lambda r: (r['male_interactions']/r['total_interactions']) if r['total_interactions']>0 else 0.0, axis=1)
    merged['female_pct'] = merged.apply(lambda r: (r['female_interactions']/r['total_interactions']) if r['total_interactions']>0 else 0.0, axis=1)
    def label_row(r):
        if r['male_pct'] >= 0.7: return 'Homme'
        if r['female_pct'] >= 0.7: return 'Femme'
        return 'Unisexe'
    merged['target_gender'] = merged.apply(label_row, axis=1)

    # keep needed columns (including interaction-based counts)
    merged = merged[['article_id','prod_name','product_type_name','product_group_name',
                     'total_purchases','male_purchases','female_purchases',
                     'purchase_count','like_count','cart_count',
                     'total_interactions','male_interactions','female_interactions','target_gender']]
    return merged, interactions, purchases

def train_text_classifier(article_df, out_dir, test_size=0.2, random_state=42):
    # drop articles without purchases (no label)
    df = article_df.dropna(subset=['target_gender']).copy()
    # text feature
    df['text'] = (df['prod_name'].fillna('') + ' ' + df['product_type_name'].fillna('') + ' ' + df['product_group_name'].fillna('')).str.strip()
    X_text = df['text']
    X_nums = df[['purchase_count','like_count','cart_count']].fillna(0)
    y = df['target_gender']

    X_train_text, X_test_text, X_train_nums, X_test_nums, y_train, y_test = train_test_split(
        X_text, X_nums, y, test_size=test_size, random_state=random_state, stratify=y
    )

    # pipeline: TF-IDF on text + scaler on numeric -> concatenate -> classifier
    tfidf = TfidfVectorizer(max_features=5000, ngram_range=(1,2))
    scaler = StandardScaler()
    # fit tfidf on full training text
    X_train_tfidf = tfidf.fit_transform(X_train_text)
    X_test_tfidf = tfidf.transform(X_test_text)
    # scale numeric
    scaler.fit(X_train_nums)
    X_train_nums_s = scaler.transform(X_train_nums)
    X_test_nums_s = scaler.transform(X_test_nums)

    # combine
    from scipy.sparse import hstack
    X_train_comb = hstack([X_train_tfidf, X_train_nums_s])
    X_test_comb = hstack([X_test_tfidf, X_test_nums_s])

    clf = LogisticRegression(max_iter=1000, multi_class='multinomial', solver='lbfgs', class_weight='balanced', random_state=42)
    clf.fit(X_train_comb, y_train)

    # save model components
    model = {
        'tfidf': tfidf,
        'scaler': scaler,
        'clf': clf
    }
    joblib.dump(model, os.path.join(out_dir,'product_gender_classifier.pkl'))

    # simple eval
    acc = clf.score(X_test_comb, y_test)
    return model, acc, len(X_train_text), len(X_test_text)

def main():
    parser = argparse.ArgumentParser()
    default_input = r'C:\Users\U\Downloads\data-fusionnee\data_fusionnee.csv'
    parser.add_argument('--input', required=False, default=default_input, help=f'CSV input path (default: {default_input})')
    parser.add_argument('--out_dir', default=r'C:\Users\U\Downloads\data-fusionnee', help='output dir')
    parser.add_argument('--svd_comp', type=int, default=50)
    parser.add_argument('--test_size', type=float, default=0.2, help='Proportion for test set (default 0.2)')
    parser.add_argument('--predict_name', required=False, help='If set, predict for a single product name')
    parser.add_argument('--predict_category', required=False, help='If set, predict for a single product category/type')
    args = parser.parse_args()
    os.makedirs(args.out_dir, exist_ok=True)

    if not os.path.isfile(args.input):
        raise FileNotFoundError(f"Input file not found: {args.input}")
    df = pd.read_csv(args.input)

    # build article-level table and interactions
    article_table, interactions, purchases = build_table(df)

    # train classifier on articles (text + interaction counts)
    model, acc, n_train, n_test = train_text_classifier(article_table, args.out_dir, test_size=args.test_size)

    # build report (only report file as requested)
    summary = article_table['target_gender'].value_counts().to_dict()
    report_lines = []
    report_lines.append("Rapport de résultats\n")
    report_lines.append(f"Fichier source: {args.input}\n")
    report_lines.append(f"Total produits analysés: {len(article_table)}\n")
    report_lines.append("Répartition par genre cible:\n")
    for k in ['Homme','Femme','Unisexe']:
        report_lines.append(f"  {k}: {summary.get(k,0)}\n")
    report_lines.append(f"\nTaille train/test (articles): {n_train}/{n_test}\n")
    report_lines.append(f"Classifieur textuel entraîné. Accuracy (test): {acc:.4f}\n")
    report_lines.append("\nRègle de classification (label de référence): Homme si achats masculins >= 70%, Femme si achats féminins >= 70%, sinon Unisexe\n")

    # listes complètes par genre (toutes les lignes), puis top10 séparé pour le rapport
    top_male_full = article_table[article_table['target_gender']=='Homme'].sort_values('male_interactions', ascending=False)
    top_female_full = article_table[article_table['target_gender']=='Femme'].sort_values('female_interactions', ascending=False)
    top_unisex_full = article_table[article_table['target_gender']=='Unisexe'].sort_values('total_interactions', ascending=False)

    # copies limitées pour inclusion dans le rapport (top 10)
    top_male = top_male_full.head(10)
    top_female = top_female_full.head(10)
    top_unisex = top_unisex_full.head(10)

    report_lines.append("\nTop 10 produits (Homme) par male_interactions:\n")
    for _, r in top_male.iterrows():
        report_lines.append(f"  {r['article_id']} | {r['prod_name']} | male_interactions={int(r['male_interactions'])}\n")

    report_lines.append("\nTop 10 produits (Femme) par female_interactions:\n")
    for _, r in top_female.iterrows():
        report_lines.append(f"  {r['article_id']} | {r['prod_name']} | female_interactions={int(r['female_interactions'])}\n")

    report_lines.append("\nTop 10 produits (Unisexe) par total_interactions:\n")
    for _, r in top_unisex.iterrows():
        report_lines.append(f"  {r['article_id']} | {r['prod_name']} | total_interactions={int(r['total_interactions'])}\n")

    # Sauvegarder les listes complètes par genre en CSV
    cols_out = ['article_id','prod_name','product_type_name','product_group_name',
                'total_interactions','male_interactions','female_interactions',
                'purchase_count','like_count','cart_count',
                'total_purchases','male_purchases','female_purchases','target_gender']
    article_table[article_table['target_gender']=='Homme'][cols_out].to_csv(os.path.join(args.out_dir,'products_homme.csv'), index=False)
    article_table[article_table['target_gender']=='Femme'][cols_out].to_csv(os.path.join(args.out_dir,'products_femme.csv'), index=False)
    article_table[article_table['target_gender']=='Unisexe'][cols_out].to_csv(os.path.join(args.out_dir,'products_unisexe.csv'), index=False)

    # Sauvegarder les listes complètes par genre (tous les produits)
    top_male_full[cols_out].to_csv(os.path.join(args.out_dir,'all_products_homme.csv'), index=False)
    top_female_full[cols_out].to_csv(os.path.join(args.out_dir,'all_products_femme.csv'), index=False)
    top_unisex_full[cols_out].to_csv(os.path.join(args.out_dir,'all_products_unisexe.csv'), index=False)

    report_path = os.path.join(args.out_dir,'report_results.txt')
    with open(report_path, 'w', encoding='utf8') as f:
        f.writelines(report_lines)

    # If user requested an immediate prediction
    if args.predict_name:
        name = args.predict_name
        category = args.predict_category if args.predict_category else ''
        text = (name + ' ' + category).strip()
        tfidf = model['tfidf']
        scaler = model['scaler']
        clf = model['clf']
        X_t = tfidf.transform([text])
        # for counts we don't have interaction counts for new product; set zeros
        nums = np.array([[0,0,0]])
        nums_s = scaler.transform(nums)
        from scipy.sparse import hstack
        X_comb = hstack([X_t, nums_s])
        pred = clf.predict(X_comb)[0]
        print(pred)
    else:
        # print only report path and accuracy
        print('Saved report:', report_path)
        print('Saved model:', os.path.join(args.out_dir,'product_gender_classifier.pkl'))
        print('Accuracy (test):', acc)
        print('Saved CSVs:', os.path.join(args.out_dir,'products_homme.csv'), os.path.join(args.out_dir,'products_femme.csv'), os.path.join(args.out_dir,'products_unisexe.csv'))

if __name__ == '__main__':
    main()
