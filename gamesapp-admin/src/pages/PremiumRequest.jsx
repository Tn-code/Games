import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { PAYMENT_CONFIG } from '../config/payment';

export function PremiumRequest({ item, type, onClose }) {
  const { user } = useAuth();
  const { addItem } = useFirestore('premiumRequests');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [step, setStep] = useState('request');
  const [requestType, setRequestType] = useState('single'); // 'single' or 'subscription'
  const [formData, setFormData] = useState({
    phoneNumber: '',
    fullName: user?.displayName || '',
    email: user?.email || '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (!formData.phoneNumber || formData.phoneNumber.length < 8) {
      setMessage({ type: 'error', text: '⚠️ Veuillez entrer un numéro de téléphone valide (au moins 8 chiffres)' });
      setLoading(false);
      return;
    }

    try {
      let requestData = {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email,
        fullName: formData.fullName || user.displayName || user.email,
        phoneNumber: formData.phoneNumber,
        email: formData.email || user.email,
        notes: formData.notes || '',
        paymentMethod: paymentMethod,
        requestedAt: new Date().toISOString(),
        adminApproved: false,
        status: 'pending'
      };

      if (requestType === 'subscription') {
        // Monthly subscription request
        requestData = {
          ...requestData,
          itemId: 'subscription_monthly',
          itemName: 'Abonnement Mensuel Premium',
          itemType: 'subscription',
          price: PAYMENT_CONFIG.subscription.monthly.price,
          currency: 'TND',
          subscription: true,
          duration: 'monthly'
        };
      } else {
        // Single item request
        requestData = {
          ...requestData,
          itemId: item.id,
          itemName: item.name || item.title,
          itemType: type,
          price: PAYMENT_CONFIG.prices[type]?.premium || 1,
          currency: 'TND',
          subscription: false
        };
      }

      const result = await addItem(requestData);
      
      if (result.success) {
        setStep('success');
        setMessage({ type: 'success', text: '✅ Demande envoyée à l\'admin ! Vous serez notifié une fois approuvé.' });
      } else {
        setMessage({ type: 'error', text: `❌ Erreur: ${result.error}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Erreur: ${error.message}` });
    }
    setLoading(false);
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-3xl">⭐</span>
              Accès Premium
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          {step === 'success' ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-check text-4xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Demande Envoyée ! 🎉</h3>
              <p className="text-gray-500 mt-2">
                Votre demande d'accès premium a été envoyée à l'administrateur.
                Vous serez notifié une fois approuvé.
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
              >
                Fermer
              </button>
            </div>
          ) : (
            <>
              {/* Item Details */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-purple-200 rounded-xl flex items-center justify-center text-3xl">
                    {type === 'story' && '📚'}
                    {type === 'video' && '🎬'}
                    {type === 'quiz' && '🧩'}
                    {type === 'subscription' && '⭐'}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {requestType === 'subscription' ? 'Abonnement Premium' : `Premium ${type}`}
                    </p>
                    <p className="font-semibold text-gray-800">
                      {requestType === 'subscription' ? 'Accès illimité à tout le contenu premium' : (item.name || item.title)}
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {requestType === 'subscription' 
                        ? PAYMENT_CONFIG.subscription.monthly.label 
                        : PAYMENT_CONFIG.prices[type]?.label || '1 DT'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Request Type Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-crown text-yellow-500 mr-2"></i>
                  Type d'accès
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRequestType('single')}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      requestType === 'single'
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-xl">📖</div>
                      <span className="text-sm font-medium">Un seul</span>
                      <span className="text-xs text-gray-500 block">{PAYMENT_CONFIG.prices[type]?.label || '1 DT'}</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRequestType('subscription')}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      requestType === 'subscription'
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-xl">⭐</div>
                      <span className="text-sm font-medium">Abonnement</span>
                      <span className="text-xs text-gray-500 block">10 DT / mois</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Message */}
              {message.text && (
                <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 ${
                  message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleRequest}>
                {/* Contact Information */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fas fa-phone mr-2 text-purple-500"></i>
                    Numéro de Téléphone * (pour contact)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-3 bg-gray-100 rounded-xl text-gray-600">+216</span>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="12 345 678"
                      className="input-field flex-1"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Nous vous contacterons sur ce numéro</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <i className="fas fa-user mr-1 text-gray-400"></i>
                      Nom Complet
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <i className="fas fa-envelope mr-1 text-gray-400"></i>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <i className="fas fa-comment mr-1 text-gray-400"></i>
                    Notes supplémentaires (Optionnel)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Toute demande spéciale ou question..."
                    className="input-field min-h-[60px]"
                  />
                </div>

                {/* Payment Method */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fas fa-credit-card mr-2 text-purple-500"></i>
                    Méthode de Paiement (Tunisie)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['card', 'edinar', 'flouci', 'd17'].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`p-3 rounded-xl border-2 transition-all text-sm ${
                          paymentMethod === method
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <i className={`fas ${
                            method === 'card' ? 'fa-credit-card' :
                            method === 'edinar' ? 'fa-mobile-alt' :
                            method === 'flouci' ? 'fa-wallet' :
                            'fa-university'
                          }`}></i>
                          <span>{method.toUpperCase()}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info */}
                <div className="bg-yellow-50 rounded-xl p-4 mb-4 border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <i className="fas fa-info-circle mr-2"></i>
                    Cette demande sera approuvée par l'administrateur.
                    Vous serez notifié une fois approuvé.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane mr-2"></i>
                      Demander l'Accès Premium
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center mt-3">
                  Vous serez contacté sur votre numéro de téléphone pour les détails de paiement
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
