import React, { useState, useEffect } from 'react';
import Login  from './Login';
import Register from './Register';
import './output.css';

function handleUnauthorized(setUser) {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setUser(null);
}

function App() {
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [phone, setPhone] = useState('');
  const [avisList, setAvisList] = useState([]);
  const [error, setError] = useState('');
  const [errorAvis, setErrorAvis] = useState('');
  const [searchRequested, setSearchRequested] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  // Champs pour ajout d’avis
  const [newAvis, setNewAvis] = useState({
    client_phone: '',
    is_positive: true,
    message: ''
  });
  const [addMessage, setAddMessage] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);


  const handleSearch = async () => {
    setError('');

    // ✅ Contrôle côté client avant appel à l'API
    const phoneTrimmed = phone.trim();

    const phoneRegex = /^[0-9]{6,15}$/;
    if (!phoneTrimmed) {
      return setError("Veuillez entrer un numéro de téléphone.");
    }

    if (!phoneRegex.test(phoneTrimmed)) {
      return setError("Numéro invalide : exemple 06617745837.");
    }

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_URL}/api/avis/${phone}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized(setUser);
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setAvisList([]);
        return setError(data.message || 'Erreur');
      }

      setAvisList(data.avis);
      setSearchRequested(true);
      
    } catch (err) {
      setError('Erreur serveur');
    }
  };

  const handleAddAvis = async () => {
    setErrorAvis('');
    setAddMessage('');

    // ✅ Vérification avant envoi
    const phoneTrimmed = newAvis.client_phone.trim();
    const phoneRegex = /^[0-9]{6,15}$/;

    if (!phoneTrimmed) {
      return setErrorAvis("Veuillez entrer le numéro du client.");
    }

    if (!phoneRegex.test(phoneTrimmed)) {
      return setErrorAvis("Numéro invalide : utilisez uniquement des chiffres (entre 6 et 15).");
    }

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_URL}/api/avis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          client_phone: newAvis.client_phone,
          is_positive: newAvis.is_positive,
          message: newAvis.message
        })
      });

      if (res.status === 401|| res.status === 403) {
        handleUnauthorized(setUser);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        return setAddMessage(data.message || 'Erreur');
      }

      setAddMessage('\nAvis ajouté sur le ' + newAvis.client_phone + '\n');
      setNewAvis({ client_phone: '', is_positive: true, message: '' });

      // Refresh de la recherche si même numéro
      if (newAvis.client_phone === phone) {
      //  setPhone(newAvis.client_phone);
        handleSearch();
      }
    } catch (err) {
      setAddMessage('Erreur serveur');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setAvisList([]);
    setPhone('');
    setAddMessage('');
    setError('');
    setErrorAvis('');
    setSearchRequested(false);
  };

  if (!user) {
    return isRegistering ? (
      <Register
        onRegister={() => setIsRegistering(false)}
        onToggle={() => setIsRegistering(false)}
      />
    ) : (
      <Login
        onLogin={setUser}
        onToggle={() => setIsRegistering(true)}
      />
    );
  }

return (
<div className="min-h-screen bg-white text-gray-800 flex flex-col justify-start">
  {/* En-tête avec logo et slogan */}
  <div className="flex flex-col lg:flex-row items-center justify-center gap-10 px-6 py-10 bg-white">
    <img
      src="/logoadaptepageacceuil.png"
      alt="colis non reçu"
      className="w-full max-w-[160px] rounded-lg"
    />
    <h1 className="text-2xl lg:text-3xl font-bold text-center">
      Évitez les clients qui ne récupèrent pas leurs commandes !
    </h1>
  </div>

  {/* Contenu principal */}
  <div className="max-w-6xl mx-auto px-4 pb-10">
    {/* Header utilisateur */}
    <div className="flex items-center justify-between mb-8 p-5 bg-gray-50 border border-gray-200 rounded-xl shadow">
      <div>
        <h2 className="text-2xl font-bold">👋 Bienvenue</h2>
        <p className="text-xl text-gray-600">{user.email}</p>
      </div>
      <button
        onClick={handleLogout}
        className="text-sm bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg font-medium"
      >
        Déconnexion
      </button>
    </div>

    {/* Contenu principal en deux colonnes */}
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Colonne gauche - Recherche + Résultats */}
      <div className="w-full lg:w-1/2 space-y-8">
        {/* Recherche */}
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-3">🔍 Rechercher un numéro</h3>
          <input
            type="text"
            placeholder="Numéro de téléphone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg"
          >
            Rechercher
          </button>
          {error && (
            <div className="mt-3 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.58-1.14.99-2L13.414 4c-.525-.9-1.842-.9-2.368 0L3.05 17c-.59.86-.063 2 .99 2z" />
              </svg>
              {error}
            </div>
          )}
        </div>

        {/* Résultats */}
        <div>
          <h3 className="text-lg font-semibold mb-4">📄 Résultats</h3>
          {searchRequested && avisList.length === 0 ? (
            <p className="text-gray-500 text-lg font-semibold">Aucun avis trouvé pour le numéro<br />Soyez le premier à ajouter un avis !</p>
          ) : (
            <div className="grid gap-4">
              {avisList.map((avis, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-lg font-semibold px-3 py-1 rounded-full ${
                        avis.is_positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {avis.is_positive ? '👍 Avis positif' : '👎 Avis négatif'}
                    </span>
                    <div className="text-sm text-gray-500">
                      {new Date(avis.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  {avis.message && <p className="text-gray-800 mb-2 text-base">📝 {avis.message}</p>}
                  <div className="flex items-center gap-3">
                    <img src="/logouser.png" alt="avatar" className="w-12 h-12 rounded-full" />
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{avis.professional_email}</span><br />
                      <span>Professionnel</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Colonne droite - Ajout d'avis */}
      <div className="w-full lg:w-1/2 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">📝 Ajouter un avis</h3>
        <input
          type="text"
          placeholder="Numéro du client"
          value={newAvis.client_phone}
          onChange={(e) => setNewAvis({ ...newAvis, client_phone: e.target.value })}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={newAvis.is_positive ? 'positive' : 'negative'}
          onChange={(e) => setNewAvis({ ...newAvis, is_positive: e.target.value === 'positive' })}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-3 focus:outline-none"
        >
          <option value="positive">👍 Avis positif</option>
          <option value="negative">👎 Avis négatif</option>
        </select>
        <textarea
          placeholder="Message (facultatif)"
          value={newAvis.message}
          onChange={(e) => setNewAvis({ ...newAvis, message: e.target.value })}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddAvis}
          className="w-full bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 rounded-lg"
        >
          Ajouter l’avis
        </button>

        {errorAvis && (
          <div className="mt-3 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm flex items-center gap-2">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.58-1.14.99-2L13.414 4c-.525-.9-1.842-.9-2.368 0L3.05 17c-.59.86-.063 2 .99 2z" />
            </svg>
            {errorAvis}
          </div>
        )}

        {addMessage && (
          <p className="text-gray-500 text-lg font-semibold mt-3 text-center animate-bounce">
            {addMessage}
          </p>
        )}
      </div>
    </div>
  </div>
</div>




);

}

export default App;
