import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { login, register, loginWithGoogle } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    let result;
    if (isRegistering) {
      result = await register(email, password, displayName);
      if (result.success) {
        setSuccessMessage('✅ Account created! Please check your email to verify.');
        setIsRegistering(false);
        setEmail('');
        setPassword('');
        setDisplayName('');
        setLoading(false);
        return;
      }
    } else {
      result = await login(email, password);
    }

    if (!result.success) {
      setError(result.error.replace('Firebase: ', ''));
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    const result = await loginWithGoogle();
    if (!result.success) {
      setError(result.error.replace('Firebase: ', ''));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-blue-600/30">
              <i className="fas fa-gamepad text-3xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isRegistering ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {isRegistering ? 'Sign up to start playing' : 'Sign in to your account'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2">
              <i className="fas fa-check-circle"></i>
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegistering && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-user mr-2 text-gray-400"></i>
                  Full Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="input-field"
                  placeholder="John Doe"
                  required={isRegistering}
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-envelope mr-2 text-gray-400"></i>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-lock mr-2 text-gray-400"></i>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
                minLength="6"
              />
              {isRegistering && (
                <p className="text-xs text-gray-400 mt-1">Password must be at least 6 characters</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isRegistering ? 'Creating Account...' : 'Signing in...'}
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  {isRegistering ? 'Create Account' : 'Sign In'}
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 text-gray-700 font-medium"
          >
            <i className="fab fa-google text-red-500 text-xl"></i>
            Google
          </button>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setSuccessMessage('');
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {isRegistering 
                ? 'Already have an account? Sign In' 
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
