// src/Login.js
import React, { useState } from 'react';
import './output.css';

function Login({ onLogin, onToggle }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const API_URL = process.env.REACT_APP_API_URL;

  const handleLogin = async () => {
    
    setError('');
    // ✅ Vérification des champs
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Adresse email invalide.");
      return;
    }

    try {
      setError('');

      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        return setError(data.message || 'Erreur de connexion');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError('Erreur serveur');
    }
  };

  return (
 
   <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-8">
    
      {/* Bloc d'infos / promotion */}
      <div className="mb-6 w-full max-w-md">
        <div className="bg-white p-6 rounded-xl shadow-md space-y-3">
          <h2 className="text-xl font-bold text-gray-800">🔍 Vérifiez vos clients avant d'envoyer !</h2>
          <ul className="text-gray-700 text-sm list-disc pl-5 space-y-1">
            <li>Vérifiez la réputation et la fiabilité de vos clients avant de leur envoyer des colis.</li>
            <li>Évitez les mauvais clients qui ne récupèrent pas leurs commandes.</li>
            <li>Obtenez des informations partagées par d'autres professionnels.</li>
            <li>Profitez d'une application <strong>gratuite et sans publicité</strong>.</li>
            <li>Utilisez notre base de données communautaire de notes client.</li>
          </ul>
        </div>
      </div>







      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 space-y-5">
        <h2 className="text-2xl font-bold text-center text-gray-800">🔐 Connexion</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Se connecter
        </button>

        <button
          onClick={onToggle}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 rounded-lg transition"
        >
          S'inscrire →
        </button>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
      </div>
    </div>
  );
}

export default Login;
