import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { UserDashboard } from './pages/UserDashboard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { EditStory } from './pages/EditStory';
import { EditQuiz } from './pages/EditQuiz';
import { EditVideo } from './pages/EditVideo';

function AppContent() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Login />;
  }

  // Admin routes
  if (isAdmin) {
    return (
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/edit-story/:id" element={<EditStory />} />
          <Route path="/edit-quiz/:id" element={<EditQuiz />} />
          <Route path="/edit-video/:id" element={<EditVideo />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    );
  }

  // User routes
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<UserDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
