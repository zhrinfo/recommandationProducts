
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./detailProduit.css";

export default function DetailProduit() {
	const { productId } = useParams();
	const [produit, setProduit] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!productId) return;
		setLoading(true);
		fetch(`http://localhost:8082/api/products/${productId}`)
			.then((res) => {
				if (!res.ok) throw new Error("Produit non trouvé");
				return res.json();
			})
			.then((data) => {
				setProduit(data);
				setError(null);
			})
			.catch((err) => {
				setProduit(null);
				setError(err.message);
			})
			.finally(() => setLoading(false));
	}, [productId]);

	if (loading) return <div className="detail-produit-container">Chargement...</div>;
	if (error) return <div className="detail-produit-container">Erreur : {error}</div>;
	if (!produit) return <div className="detail-produit-container">Produit introuvable.</div>;

	return (
		<div className="detail-produit-container">
			<div className="detail-produit-card">
				<div className="detail-produit-image-section">
					<img src={produit.imageUrl} alt={produit.name} className="detail-produit-image" />
				</div>
				<div className="detail-produit-info-section">
					<h1 className="detail-produit-nom">{produit.name}</h1>
					{/* Ajoutez ici d'autres champs si l'API en fournit */}
					<p className="detail-produit-description">Catégorie : {produit.category}</p>
					<div className="detail-produit-footer">
						<span className="detail-produit-prix">{produit.price.toFixed(2)} €</span>
						<button className="detail-produit-acheter">Acheter</button>
					</div>
				</div>
			</div>
		</div>
	);
}
