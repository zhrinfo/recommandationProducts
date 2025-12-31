from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import joblib
import numpy as np
from scipy.sparse import hstack

app = Flask(__name__)
CORS(app)

# Try to load pretrained model saved by `process_and_train.py`
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'product_gender_classifier.pkl')
model = None
model_load_error = None
if os.path.isfile(MODEL_PATH):
    try:
        model = joblib.load(MODEL_PATH)
    except Exception as e:
        model_load_error = str(e)
else:
    model_load_error = f"Model file not found: {MODEL_PATH}"


@app.route('/health', methods=['GET'])
def health():
    status = {'model_loaded': model is not None}
    if model_load_error:
        status['error'] = model_load_error
    return jsonify(status)


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json() or {}

    # Accept product textual fields and optional interaction counts
    prod_name = (data.get('prod_name') or data.get('prodName') or '')
    product_type = (data.get('product_type_name') or data.get('productType') or '')
    product_group = (data.get('product_group_name') or data.get('productGroup') or '')

    # numeric features: purchase_count, like_count, cart_count
    purchase_count = float(data.get('purchase_count', 0) or 0)
    like_count = float(data.get('like_count', 0) or 0)
    cart_count = float(data.get('cart_count', 0) or 0)

    text = ' '.join([s for s in [prod_name, product_type, product_group] if s]).strip()

    if model is None:
        # Fallback: simple heuristic if model unavailable
        fallback = 'HOMME' if purchase_count + like_count + cart_count > 5 else 'FEMME'
        return jsonify({
            'input_text': text,
            'recommended_service': fallback,
            'confidence': 0.5,
            'model_loaded': False,
            'model_error': model_load_error
        })

    try:
        tfidf = model.get('tfidf')
        scaler = model.get('scaler')
        clf = model.get('clf')

        X_t = tfidf.transform([text])
        nums = np.array([[purchase_count, like_count, cart_count]])
        nums_s = scaler.transform(nums)
        X_comb = hstack([X_t, nums_s])

        pred = clf.predict(X_comb)[0]
        probs = None
        try:
            probs_arr = clf.predict_proba(X_comb)[0]
            # map classes to probabilities
            classes = clf.classes_
            probs = {str(c): float(p) for c, p in zip(classes, probs_arr)}
            confidence = float(probs.get(pred, max(probs_arr)))
        except Exception:
            confidence = 1.0

        return jsonify({
            'input_text': text,
            'recommended_service': pred,
            'confidence': confidence,
            'probabilities': probs,
            'model_loaded': True
        })
    except Exception as e:
        return jsonify({'error': str(e), 'model_loaded': True}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
