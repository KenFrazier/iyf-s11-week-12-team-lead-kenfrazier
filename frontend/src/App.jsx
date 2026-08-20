import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import './App.css';

function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="navbar">
        <h1>CommunityHub</h1>
        {isAuthenticated && (
          <div className="navbar-user">
            <span>{user.name} · {user.role}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        )}
      </header>

      <main className="main-content">
        {isAuthenticated ? (
          <div className="welcome-panel">
            <h2>Welcome, {user.name}!</h2>
            <p>You're logged in as <strong>{user.role}</strong>.</p>
          </div>
        ) : (
          <Login />
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
