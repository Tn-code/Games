import React, { useState } from 'react';

export function PaymentModal({ isOpen, onClose, item, onPaymentSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('details');

  if (!isOpen) return null;

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStep('success');
      setTimeout(() => {
        onPaymentSuccess();
        onClose();
        setStep('details');
      }, 2000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            <i className="fas fa-lock text-blue-600 mr-2"></i>
            Payment
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {step === 'details' ? (
          <>
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-500">You are purchasing:</p>
              <p className="font-semibold text-gray-800">{item?.name || item?.title || 'Content'}</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{item?.price || '€4.99'}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setPaymentMethod('card')} className={`p-3 rounded-xl border-2 transition-all ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                  <i className="fas fa-credit-card text-xl block mb-1"></i>
                  <span className="text-sm">Card</span>
                </button>
                <button onClick={() => setPaymentMethod('paypal')} className={`p-3 rounded-xl border-2 transition-all ${paymentMethod === 'paypal' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                  <i className="fab fa-paypal text-xl block mb-1"></i>
                  <span className="text-sm">PayPal</span>
                </button>
              </div>
            </div>

            <form onSubmit={handlePayment}>
              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Card Number</label>
                    <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="4242 4242 4242 4242" className="input-field" required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Expiry</label>
                      <input type="text" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" className="input-field" required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">CVV</label>
                      <input type="password" value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="•••" className="input-field" required maxLength="4" />
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50">
                {loading ? <><i className="fas fa-spinner fa-spin mr-2"></i>Processing...</> : <><i className="fas fa-lock mr-2"></i>Pay {item?.price || '€4.99'}</>}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-check text-4xl text-green-600"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Payment Successful! 🎉</h3>
            <p className="text-gray-500 mt-2">You now have access to this content</p>
            <button onClick={() => { onPaymentSuccess(); onClose(); setStep('details'); }} className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all">Continue</button>
          </div>
        )}
      </div>
    </div>
  );
}
