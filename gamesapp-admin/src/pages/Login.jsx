import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const { login, register, loginWithGoogle } = useAuth();
  const { showToast } = useToast();
  const swipeRef = useRef(null);

  const handleTouchStart = (e) => {
    if (isOpen) return;
    const touch = e.touches[0];
    setStartX(touch.clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || isOpen) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    const progress = Math.min(Math.max(deltaX / 250, 0), 1);
    setSwipeProgress(progress);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (swipeProgress > 0.85 && !isOpen) {
      setIsOpen(true);
      setSwipeProgress(1);
      showToast('🔓 Unlocked!', 'success');
    } else if (!isOpen) {
      setSwipeProgress(0);
    }
  };

  const handleMouseDown = (e) => {
    if (isOpen) return;
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || isOpen) return;
    const deltaX = e.clientX - startX;
    const progress = Math.min(Math.max(deltaX / 250, 0), 1);
    setSwipeProgress(progress);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (swipeProgress > 0.85 && !isOpen) {
      setIsOpen(true);
      setSwipeProgress(1);
      showToast('🔓 Unlocked!', 'success');
    } else if (!isOpen) {
      setSwipeProgress(0);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSwipeProgress(0);
    showToast('🔒 Locked', 'info');
  };

  // Auto-open animation on load
  useEffect(() => {
    const timer = setTimeout(() => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.03;
        if (progress >= 1) {
          clearInterval(interval);
          setIsOpen(true);
          setSwipeProgress(1);
          showToast('🔓 Unlocked!', 'success');
        } else {
          setSwipeProgress(progress);
        }
      }, 20);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let result;
    if (isRegistering) {
      result = await register(email, password, displayName);
      if (result.success) {
        showToast('✅ Account created! Please check your email.', 'success');
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

  const openPercent = Math.min(swipeProgress * 100, 100);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4 overflow-hidden relative">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>

      {/* Floating Python Icons */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute text-6xl opacity-10"
          style={{
            top: `${10 + i * 15}%`,
            left: `${5 + i * 18}%`,
            animation: `float ${6 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`
          }}
        >
          🐍
        </div>
      ))}

      <div className="relative w-full max-w-md">
        
        {/* Python Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3">
              <i className="fab fa-python text-5xl text-white"></i>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white">
            GamesApp
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Python Edition 🐍
          </p>
        </div>

        {/* Swipe to Open - Only visible when not open */}
        {!isOpen && (
          <div className="mb-8">
            <div 
              className="relative h-16 bg-white/10 backdrop-blur rounded-2xl border border-white/20 overflow-hidden cursor-pointer"
              ref={swipeRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Progress Bar */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl transition-all duration-150"
                style={{ width: `${openPercent}%` }}
              />
              
              {/* Glow Effect */}
              {openPercent > 0 && openPercent < 100 && (
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl"
                  style={{ 
                    left: `${openPercent - 10}%`,
                    width: '20%',
                    filter: 'blur(10px)'
                  }}
                />
              )}
              
              {/* Text */}
              <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium z-10">
                <span className="flex items-center gap-3">
                  <i className="fas fa-arrow-right animate-pulse"></i>
                  <span className="text-white/80">Swipe to Unlock</span>
                  <i className="fas fa-arrow-right animate-pulse"></i>
                </span>
              </div>
              
              {/* Swipe Knob */}
              <div 
                className="absolute top-1.5 w-12 h-12 bg-white rounded-2xl shadow-2xl transition-all duration-150 flex items-center justify-center z-20"
                style={{ 
                  left: `${Math.min(openPercent, 92)}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                <span className="text-xl">🔒</span>
              </div>
            </div>
            
            <p className="text-center text-white/30 text-xs mt-3">
              Swipe right to unlock login
            </p>
          </div>
        )}

        {/* Login Form - Only visible when swiped open */}
        {isOpen && (
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 border border-white/20 animate-bounceIn">
            
            {/* Close Button */}
            <div className="flex justify-end mb-2">
              <button
                onClick={handleClose}
                className="text-white/40 hover:text-white/80 transition-all hover:rotate-90 duration-300 text-xl"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <i className="fab fa-python text-3xl text-white"></i>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white">
                {isRegistering ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-white/60 text-sm mt-1">
                {isRegistering ? 'Join the Python adventure!' : 'Sign in to continue'}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {isRegistering && (
                <div className="mb-3">
                  <label className="block text-sm font-medium text-white/80 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all text-sm"
                    placeholder="John Doe"
                    required={isRegistering}
                  />
                </div>
              )}

              <div className="mb-3">
                <label className="block text-sm font-medium text-white/80 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all text-sm"
                  placeholder="admin@example.com"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-white/80 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all text-sm"
                  placeholder="••••••••"
                  required
                  minLength="6"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt"></i>
                    {isRegistering ? 'Create Account' : 'Sign In'}
                  </>
                )}
              </button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/20"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-4 bg-transparent text-white/40 text-xs">Or continue with</span></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all text-white font-medium text-sm"
            >
              <i className="fab fa-google text-red-400 text-lg"></i>
              Google
            </button>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-xs text-white/60 hover:text-white transition-all"
              >
                {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex justify-center">
              <div className="flex items-center gap-2 text-white/30 text-[10px]">
                <i className="fab fa-python text-blue-400"></i>
                <span>Python 3.11</span>
                <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                <span>🐍 GamesApp</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes bounceIn {
          0% { transform: scale(0.95); opacity: 0; }
          50% { transform: scale(1.02); }
          70% { transform: scale(0.98); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-bounceIn {
          animation: bounceIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
