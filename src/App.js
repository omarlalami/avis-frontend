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
      return setError("❌ Veuillez entrer un numéro de téléphone.");
    }

    if (!phoneRegex.test(phoneTrimmed)) {
      return setError("❌ Numéro invalide : utilisez uniquement des chiffres (entre 6 et 15).");
    }

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`http://localhost:5000/api/avis/${phone}`, {
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
    } catch (err) {
      setError('Erreur serveur');
    }
  };

  const handleAddAvis = async () => {
    setAddMessage('');

    // ✅ Vérification avant envoi
    const phoneTrimmed = newAvis.client_phone.trim();
    const phoneRegex = /^[0-9]{6,15}$/;

    if (!phoneTrimmed) {
      return setAddMessage("❌ Veuillez entrer un numéro de téléphone.");
    }

    if (!phoneRegex.test(phoneTrimmed)) {
      return setAddMessage("❌ Numéro invalide : utilisez uniquement des chiffres (entre 6 et 15).");
    }

    try {
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:5000/api/avis', {
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

      setAddMessage('✅ Avis ajouté');
      setNewAvis({ client_phone: '', is_positive: true, message: '' });

      // Refresh de la recherche si même numéro
      if (newAvis.client_phone === phone) {
        handleSearch();
      }
    } catch (err) {
      setAddMessage('Erreur serveur');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
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

<div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
  {/* Header utilisateur */}
  <div className="flex items-center justify-between mb-8 p-5 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
    <div>
      <h2 className="text-2xl font-bold text-gray-800">👋 Bienvenue</h2>
      <p className="text-sm text-gray-600">{user.email}</p>
    </div>
    <button
      onClick={handleLogout}
      className="text-sm bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg transition font-medium"
    >
      Déconnexion
    </button>
  </div>

  {/* Contenu principal en colonnes */}
  <div className="flex flex-col lg:flex-row gap-8">
    {/* Colonne gauche */}
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
        >
          Rechercher
        </button>
        {error && <p className="text-red-600 mt-3">{error}</p>}
      </div>

      {/* Résultats */}
      <div>
        <h3 className="text-lg font-semibold mb-4">📄 Résultats</h3>

        {avisList.length === 0 ? (
          <p className="text-gray-500">Aucun avis trouvé pour ce numéro.</p>
        ) : (
          <div className="grid gap-4">
            {avisList.map((avis, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      avis.is_positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {avis.is_positive ? '👍 Avis positif' : '👎 Avis négatif'}
                  </span>
                </div>

                {avis.message && (
                  <p className="text-gray-800 mb-2 text-sm">📝 {avis.message}</p>
                )}

                <div className="text-xs text-gray-500">
                  Posté par : <span className="font-medium">{avis.professional_email}</span><br />
                  Le : {new Date(avis.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Colonne droite */}
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
        onChange={(e) =>
          setNewAvis({ ...newAvis, is_positive: e.target.value === 'positive' })
        }
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
        className="w-full bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 rounded-lg transition"
      >
        Ajouter l’avis
      </button>
      {addMessage && <p className="mt-3 text-green-600 text-sm">{addMessage}</p>}
    </div>
  </div>
</div>


);

}

export default App;
