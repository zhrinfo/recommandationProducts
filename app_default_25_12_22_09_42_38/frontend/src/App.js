import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';

const API_URL = 'http://localhost:8080/api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [authData, setAuthData] = useState({ username: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, authData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId);
      setUser(res.data);
      setIsLoggedIn(true);
      fetchProducts(res.data.userId);
    } catch (err) {
      alert("Erreur d'authentification");
    }
  };

  const fetchProducts = async (userId) => {
    try {
      const res = await axios.get(`${API_URL}/router/products?userId=${userId}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Erreur de chargement des produits");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUser(null);
    setProducts([]);
  };

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f4f4' }}>
        <form onSubmit={handleLogin} style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2>Connexion</h2>
          <div style={{ marginBottom: '1rem' }}>
            <input 
              type="text" 
              placeholder="Nom d'utilisateur" 
              value={authData.username}
              onChange={(e) => setAuthData({...authData, username: e.target.value})}
              style={{ width: '100%', padding: '0.5rem', marginBottom: '10px' }}
            />
            <input 
              type="password" 
              placeholder="Mot de passe" 
              value={authData.password}
              onChange={(e) => setAuthData({...authData, password: e.target.value})}
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '0.75rem', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Se connecter
          </button>
          <p style={{ fontSize: '0.8rem', marginTop: '10px', color: '#666' }}>Note: Utilisez n'importe quel compte créé via register ou un compte mock.</p>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9f9f9' }}>
      <nav style={{ background: '#333', color: '#fff', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Smart Fashion Shop</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span><User size={18} /> {user.username}</span>
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #fff', color: '#fff', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <div style={{ padding: '2rem' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h2>Nos recommandations pour vous</h2>
          <p>Basé sur notre algorithme de prédiction ML intelligent.</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
          {products.map(product => (
            <div key={product.id} style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '1rem' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{product.name}</h3>
                <span style={{ color: '#007bff', fontWeight: 'bold', fontSize: '1.2rem' }}>{product.price} €</span>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>{product.category}</p>
                <button style={{ width: '100%', marginTop: '10px', padding: '0.5rem', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <ShoppingCart size={18} /> Ajouter
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
