import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './allproductH.css';

const AllProductH = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username } = useParams();

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      await fetch("http://localhost:8081/api/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "ADD_TO_CART",
          userId: username,
          productId: product.id,
          timestamp: new Date().toISOString(),
        }),
      });
      alert(`${product.name} a été ajouté au panier`);
    } catch (err) {
      console.error('Erreur lors de l\'ajout au panier:', err);
      alert('Erreur lors de l\'ajout au panier');
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/router/products/balanced');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors du chargement des produits:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des produits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Erreur: {error}</p>
        <button onClick={fetchProducts} className="retry-btn">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="all-products-container">
      <h1 className="products-title">Tous les Produits</h1>
      
      <div className="products-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="product-image"
                />
              </div>
              <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price-container">
                  <span className="product-price">
                    {product.price.toFixed(2)} €
                  </span>
                </div>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  Ajouter au panier
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-products">Aucun produit disponible</p>
        )}
      </div>
    </div>
  );
};

export default AllProductH;
