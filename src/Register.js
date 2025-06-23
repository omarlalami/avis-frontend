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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 space-y-5">
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
          ← Retour à la connexion
        </button>
        <div className="flex justify-center">
          {message && (
            <p className={`mt-3 inline-block px-4 py-2 shadow-sm text-center border rounded-md text-sm ${message.startsWith('✅') ? 'text-green-600 bg-green-100 text-green-700 border-green-300' : 'text-red-600 bg-red-100 text-red-700 border-red-300'}`}>
              {message}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

export default Register;
