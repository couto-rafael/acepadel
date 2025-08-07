import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Tournaments from './pages/Tournaments';
import TournamentDetail from './pages/TournamentDetail';
import Contact from './pages/Contact';
import UserData from './pages/UserData';
import Dashboard from './pages/Dashboard';
import ClubDashboard from './pages/ClubDashboard';
import ClubProfile from './pages/ClubProfile';
import CreateTournament from './pages/CreateTournament';
import MyTournaments from './pages/MyTournaments';
import ClubReports from './pages/ClubReports';
import MeuCadastro from './pages/MeuCadastro';
import Settings from './pages/Settings';
import Marketplace from './pages/Marketplace';
import Messages from './pages/Messages';
import Profile from './pages/Profile';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requireAuth?: boolean; allowedUserTypes?: string[] }> = ({ 
  children, 
  requireAuth = true, 
  allowedUserTypes 
}) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // Redirect to home if authentication is required but user is not logged in
        navigate('/', { replace: true });
        return;
      }

      if (user && profile && allowedUserTypes && !allowedUserTypes.includes(profile.user_type)) {
        // Redirect to appropriate dashboard if user type is not allowed
        if (profile.user_type === 'club') {
          navigate('/club-dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
        return;
      }
    }
  }, [user, profile, loading, navigate, requireAuth, allowedUserTypes]);

  if (loading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return null; // Will redirect in useEffect
  }

  if (user && profile && allowedUserTypes && !allowedUserTypes.includes(profile.user_type)) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};

function AppContent() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user && profile && location.pathname === '/') {
      // Always redirect authenticated users from home page to their dashboard
      if (profile.user_type === 'club') {
        navigate('/club-dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, profile, loading, navigate, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tournaments" element={<Tournaments />} />
      <Route path="/tournament/:id" element={<TournamentDetail />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/user-data" element={<UserData />} />
      
      {/* Protected Routes - Require Authentication */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedUserTypes={['athlete']}>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/club-dashboard" 
        element={
          <ProtectedRoute allowedUserTypes={['club']}>
            <ClubDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/club-profile" 
        element={
          <ProtectedRoute allowedUserTypes={['club']}>
            <ClubProfile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/create-tournament" 
        element={
          <ProtectedRoute allowedUserTypes={['club']}>
            <CreateTournament />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/my-tournaments" 
        element={
          <ProtectedRoute allowedUserTypes={['club']}>
            <MyTournaments />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/club-reports" 
        element={
          <ProtectedRoute allowedUserTypes={['club']}>
            <ClubReports />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute allowedUserTypes={['athlete']}>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/marketplace" 
        element={
          <ProtectedRoute>
            <Marketplace />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/messages" 
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/meu-cadastro" 
        element={
          <ProtectedRoute>
            <MeuCadastro />
          </ProtectedRoute>
        } 
      />
    </Routes>
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