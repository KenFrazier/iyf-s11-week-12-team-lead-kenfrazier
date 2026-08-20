import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import './App.css';

function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div>
      <h1>CommunityHub</h1>

      {isAuthenticated ? (
        <div>
          <p>Logged in as: {user.name} ({user.role})</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <Login />
      )}
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
