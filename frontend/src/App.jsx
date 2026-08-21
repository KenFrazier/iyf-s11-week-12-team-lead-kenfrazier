import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Issues from './pages/Issues';
import './App.css';

function CurrentTime() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <time className="current-time" dateTime={currentTime.toISOString()}>
      {currentTime.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
      })}
    </time>
  );
}

function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();
  const [view, setView] = useState('issues');
  const [authView, setAuthView] = useState('login');

  return (
    <div className="app-shell">
      <header className="navbar">
        <h1>CommunityHub</h1>
        <div className="navbar-time" aria-label="Current local time">
          <span>Local time</span>
          <CurrentTime />
        </div>
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
            {authView === 'login' ? (
              <>
                <Login />
                <div className="auth-switch">
                  <span>New to CommunityHub?</span>
                  <button type="button" onClick={() => setAuthView('register')}>
                    Create an account
                  </button>
                </div>
              </>
            ) : (
              <>
                <Register />
                <div className="auth-switch">
                  <span>Already have an account?</span>
                  <button type="button" onClick={() => setAuthView('login')}>
                    Back to login
                  </button>
                </div>
              </>
            )}
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
