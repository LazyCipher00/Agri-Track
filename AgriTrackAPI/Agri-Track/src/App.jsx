import { useState, useEffect } from 'react';
import Notification from './components/Notification';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setPage(parsedUser.role === 'Admin' ? 'admin-dashboard' : 'dashboard');
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const notify = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(n => [...n, { id, message, type }]);
    setTimeout(() => setNotifications(n => n.filter(x => x.id !== id)), 3500);
  };

  const removeNotification = id => setNotifications(n => n.filter(x => x.id !== id));

  const handleLogin = (userData) => {
    setUser(userData);
    setPage(userData.role === 'Admin' ? 'admin-dashboard' : 'dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPage('landing');
    notify('Signed out successfully', 'info');
  };

  const navigateTo = (newPage) => {
    if (newPage === 'logout') {
      handleLogout();
    } else {
      setPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4efe6' }}>
        <div style={{ textAlign: 'center' }}>
          <img src="/logo.jpg" alt="AgriTrack" style={{ width: 60, height: 60, borderRadius: 12, marginBottom: 20 }} />
          <h2 style={{ color: '#0d2410' }}>Loading AgriTrack...</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <Notification notifications={notifications} removeNotification={removeNotification} />
      
      {page === 'landing' && <LandingPage onNavigate={navigateTo} />}
      {page === 'login' && <LoginPage onNavigate={navigateTo} onLogin={handleLogin} notify={notify} />}
      {page === 'register' && <RegisterPage onNavigate={navigateTo} onLogin={handleLogin} notify={notify} />}
      {page === 'admin-login' && <AdminLogin onNavigate={navigateTo} onLogin={handleLogin} notify={notify} />}
      
      {page === 'dashboard' && user && user.role !== 'Admin' && (
        <Dashboard user={user} onLogout={handleLogout} notify={notify} />
      )}
      
      {page === 'admin-dashboard' && user && user.role === 'Admin' && (
        <AdminDashboard user={user} onLogout={handleLogout} notify={notify} />
      )}
    </>
  );
}