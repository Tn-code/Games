import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, loginWithGoogle } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let result;
    if (isRegistering) {
      result = await register(email, password, displayName);
      if (result.success) {
        showToast('✅ Account created! Please check your email to verify.', 'success');
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
      showToast(`❌ ${result.error.replace('Firebase: ', '')}`, 'error');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const result = await loginWithGoogle();
    if (result.success) {
      showToast('✅ Welcome back!', 'success');
    } else {
      showToast(`❌ ${result.error}`, 'error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
          {/* Python Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-500/10 to-blue-500/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
          
          {/* Python Logo */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 transform rotate-3">
                <div className="relative">
                  <i className="fab fa-python text-5xl text-white"></i>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-yellow-900 shadow-lg">
                    🐍
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {isRegistering ? 'Create Account' : 'Welcome Back'}
              </span>
            </h2>
            <p className="text-gray-500 text-sm mt-1 flex items-center justify-center gap-2">
              <i className="fab fa-python text-blue-500"></i>
              {isRegistering ? 'Sign up to start playing' : 'Sign in to your account'}
              <i className="fab fa-python text-blue-500"></i>
            </p>
          </div>

          {/* Python Snake Decoration */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-1 text-2xl">
              <span>🐍</span>
              <span className="text-gray-300">━</span>
              <span className="text-blue-400">━</span>
              <span className="text-purple-400">━</span>
              <span className="text-green-400">━</span>
              <span className="text-yellow-400">━</span>
              <span className="text-gray-300">━</span>
              <span>🐍</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {isRegistering && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-user mr-2 text-blue-500"></i>
                  Full Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="input-field border-2 focus:border-blue-500 focus:ring-blue-500/20"
                  placeholder="John Doe"
                  required={isRegistering}
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-envelope mr-2 text-blue-500"></i>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field border-2 focus:border-blue-500 focus:ring-blue-500/20"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-lock mr-2 text-blue-500"></i>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field border-2 focus:border-blue-500 focus:ring-blue-500/20"
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
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isRegistering ? 'Creating Account...' : 'Signing in...'}
                </>
              ) : (
                <>
                  <i className="fab fa-python"></i>
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
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all duration-200 text-gray-700 font-medium"
          >
            <i className="fab fa-google text-red-500 text-xl"></i>
            Google
          </button>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all"
            >
              {isRegistering 
                ? 'Already have an account? Sign In' 
                : "Don't have an account? Sign Up"}
            </button>
          </div>

          {/* Python Version Footer */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <i className="fab fa-python text-blue-500"></i>
              <span>Python 3.11+</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Ready</span>
            </div>
          </div>

          {/* Python Snake Animation */}
          <div className="absolute bottom-4 left-4 opacity-10 text-4xl">
            <span className="animate-pulse">🐍</span>
          </div>
          <div className="absolute top-4 right-4 opacity-10 text-4xl">
            <span className="animate-pulse delay-300">🐍</span>
          </div>
        </div>
      </div>
    </div>
  );
}
