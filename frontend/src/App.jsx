import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Issues from './pages/Issues';
import './App.css';

function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();
  const [view, setView] = useState('issues');

  return (
    <div className="app-shell">
      <header className="navbar">
        <h1>CommunityHub</h1>
        <nav className="navbar-links">
          <button onClick={() => setView('issues')} className="nav-btn">Issues</button>
        </nav>
        {isAuthenticated && (
          <div className="navbar-user">
            <span>{user.name} - {user.role}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        )}
      </header>

      <main className="main-content">
        {view === 'issues' && isAuthenticated && <Issues />}
        {view === 'issues' && !isAuthenticated && (
          <div>
            <Login />
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
              You can view issues after logging in.
            </p>
          </div>
        )}
      </main>
    </div>
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
