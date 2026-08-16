import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { PAYMENT_CONFIG, PRICE_LABELS } from '../config/payment';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function PremiumRequest({ item, type, onClose }) {
  const { user } = useAuth();
  const { addItem } = useFirestore('premiumRequests');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [step, setStep] = useState('request');

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const requestData = {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email,
        itemId: item.id,
        itemName: item.name || item.title,
        itemType: type,
        price: PAYMENT_CONFIG.prices[type]?.premium || 4.99,
        currency: 'TND',
        paymentMethod: paymentMethod,
        status: 'pending',
        requestedAt: new Date().toISOString(),
        adminApproved: false
      };

      const result = await addItem(requestData);
      
      if (result.success) {
        setStep('success');
        setMessage({ type: 'success', text: '✅ Request sent to admin! You will be notified once approved.' });
      } else {
        setMessage({ type: 'error', text: `❌ Error: ${result.error}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    }
    setLoading(false);
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-3xl">⭐</span>
              Premium Access
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
              <h3 className="text-xl font-bold text-gray-800">Request Sent! 🎉</h3>
              <p className="text-gray-500 mt-2">
                Your request for premium access has been sent to the admin.
                You will receive a notification once approved.
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium"
              >
                Close
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
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Premium {type}</p>
                    <p className="font-semibold text-gray-800">{item.name || item.title}</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {PAYMENT_CONFIG.prices[type]?.label || '4.99 DT'}
                    </p>
                  </div>
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
                {/* Payment Method */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fas fa-credit-card mr-2 text-purple-500"></i>
                    Payment Method (Tunisia)
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
                    This is a request for premium access. The admin will approve it.
                    You'll be notified when approved.
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
                      Sending Request...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane mr-2"></i>
                      Request Premium Access
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center mt-3">
                  You will be notified by email when approved
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
