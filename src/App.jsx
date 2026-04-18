import { useState } from 'react';
import Notification from './components/Notification';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';

// ─── ROOT APP ───────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState('landing'); // landing | login | register | dashboard
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const notify = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(n => [...n, { id, message, type }]);
    setTimeout(() => setNotifications(n => n.filter(x => x.id !== id)), 3500);
  };

  const removeNotification = id => setNotifications(n => n.filter(x => x.id !== id));

  const handleLogin = (userData) => {
    setUser(userData);
    setPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setPage('landing');
    notify('Signed out successfully', 'info');
  };

  return (
    <>
      <Notification notifications={notifications} removeNotification={removeNotification} />
      {page === 'landing' && <LandingPage onNavigate={setPage} />}
      {page === 'login' && <LoginPage onNavigate={setPage} onLogin={handleLogin} notify={notify} />}
      {page === 'register' && <RegisterPage onNavigate={setPage} onLogin={handleLogin} notify={notify} />}
      {page === 'dashboard' && user && <Dashboard user={user} onLogout={handleLogout} notify={notify} />}
    </>
  );
}
