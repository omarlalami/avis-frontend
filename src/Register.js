// src/Register.js
import React, { useState } from 'react';
import './output.css';

function Register({ onRegister, onToggle }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [message, setMessage] = useState('');
  const API_URL = process.env.REACT_APP_API_URL;

  const handleRegister = async () => {

    setMessage('');
    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailTrimmed) {
      return setMessage("L'email est requis.");
    }
    if (!emailRegex.test(emailTrimmed)) {
      return setMessage("L'email est invalide.");
    }
    if (!passwordTrimmed) {
      return setMessage("Le mot de passe est requis.");
    }
    if (passwordTrimmed.length < 6) {
      return setMessage("Le mot de passe doit contenir au moins 6 caractères.");
    }
    
    try {
      setMessage('');
      const res = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        return setMessage(data.message || 'Erreur');
      }

      setMessage('✅ Inscription réussie, connectez-vous.');
      //onRegister && onRegister(); // Callback (ex: switch vers login)
    } catch (err) {
      setMessage('Erreur serveur');
    }
  };

  return (
<div className="min-h-screen bg-white text-gray-800 flex flex-col">
  {/* En-tête */}
  <div className="flex flex-col lg:flex-row items-center justify-center gap-10 px-6 py-10 bg-white border-b border-gray-100">
    <img
      src="/logoadaptepageacceuil.png"
      alt="colis non reçu"
      className="w-full max-w-[160px] rounded-lg"
    />
    <h1 className="text-2xl lg:text-3xl font-bold text-center leading-relaxed">
      Évitez les clients qui ne récupèrent pas leurs commandes !
    </h1>
  </div>

  {/* Section Inscription */}
  <div className="flex justify-center px-4 py-12 bg-gray-50">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        👤 Inscription
      </h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />

      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />

      <button
        onClick={handleRegister}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
      >
        S'inscrire
      </button>

      <button
        onClick={onToggle}
        className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 rounded-lg transition"
      >
        Vous avez déjà un compte ? Se connecter
      </button>

      {message && (
        <div className="flex justify-center">
          <p
            className={`mt-3 inline-block px-4 py-2 shadow-sm text-center border rounded-md text-sm ${
              message.startsWith('✅')
                ? 'text-green-700 bg-green-100 border-green-300'
                : 'text-red-700 bg-red-100 border-red-300'
            }`}
          >
            {message}
          </p>
        </div>
      )}
    </div>
  </div>
</div>

  );
}

export default Register;
