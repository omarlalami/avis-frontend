// src/Login.js
import React, { useState, useEffect } from 'react';
import './output.css';


function Login({ onLogin, onToggle }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const API_URL = process.env.REACT_APP_API_URL;

  const avisList = [
    {
      is_positive: false,
      created_at: '2024-12-10',
      message: "Client n'a jamais récupéré sa commande malgré plusieurs relances.",
      professional_email: 'pro1@example.com',
    },
    {
      is_positive: true,
      created_at: '2024-12-05',
      message: "Client sérieux et ponctuel, tout s'est bien passé.",
      professional_email: 'pro2@example.com',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % avisList.length);
    }, 4000); // change every 4 seconds

    return () => clearInterval(interval);
  }, [avisList.length]);


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

    <div className="min-h-screen bg-white text-gray-800 flex flex-col justify-between">
      {/* En-tête */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold">🚫 Évitez les clients qui ne récupèrent pas leurs commandes !</h1>
      </div>

      {/* Partie principale : avis défilants + login */}
      <div className="flex flex-col lg:flex-row justify-center items-start px-4 lg:px-20 gap-10">
        {/* Avis défilants */}
        

        {/* Avis défilants (un seul à la fois) */}
        <div className="flex-1 max-w-xl relative h-[220px]">
          <div className="absolute w-full h-full">
            {avisList.map((avis, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  currentIndex === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-lg font-semibold px-3 py-1 rounded-full ${
                        avis.is_positive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {avis.is_positive ? '👍 Avis positif' : '👎 Avis négatif'}
                    </span>

                    <div className="text-lg text-gray-500">
                      {new Date(avis.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </div>
                  </div>

                  {avis.message && (
                    <p className="text-gray-800 mb-2 text-lg flex">📝 {avis.message}</p>
                  )}

                  <div className="flex items-center gap-3">
                    <img
                      src="/logouser.png"
                      alt="avatar"
                      className="w-14 h-14 rounded-full"
                    />
                    <div className="text-base text-gray-500">
                      <span className="font-medium">{avis.professional_email}</span><br />
                      <span className="font-medium">Professionnel</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulaire de connexion */}
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 space-y-5">
          <h2 className="text-2xl font-bold text-center text-gray-800">🔐 Connexion</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

      {/* Bas de page */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 p-10 bg-white">
        <img
          src="https://blog.eurosender.com/wp-content/uploads/2022/03/colis-livre-mais-non-recu.webp"
          alt="colis non reçu"
          className="w-full max-w-sm rounded-lg shadow-md"
        />

        <div className="text-left space-y-3 max-w-2xl">
          <p className="text-lg font-semibold">
            Notre objectif est d'aider les professionnels à réduire les envois aux clients qui ne récupèrent pas leurs commandes.
          </p>
          <p className="text-base text-gray-700">✅ Vérifiez la réputation et la fiabilité de vos clients avant l'envoi.</p>
          <ul className="list-disc pl-5 text-gray-600 space-y-1">
            <li>❌ Éviter les mauvais clients qui ne récupèrent pas les commandes</li>
            <li>📌 Obtenez des informations sur les utilisateurs</li>
            <li>🎁 Profitez d'une application gratuite et sans publicité</li>
            <li>🗂️ Utilisez notre base de notes de clients</li>
          </ul>
        </div>
      </div>
    </div>
  );

};

export default Login;
