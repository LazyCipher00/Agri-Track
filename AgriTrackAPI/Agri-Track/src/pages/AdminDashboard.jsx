import { useState, useEffect } from 'react';
import { Icon, icons } from '../components/Icon';
import { adminAPI } from '../services/api';
import AdminUsers from './AdminUsers';
import AdminReports from './AdminReports';

function AdminDashboard({ user, onLogout, notify }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const data = await adminAPI.getDashboardStats();
      setStats(data);
    } catch (error) {
      notify('Failed to load dashboard stats', 'error');
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: icons.grid },
    { id: 'users', label: 'User Management', icon: icons.user },
    { id: 'reports', label: 'Reports', icon: icons.sales },
  ];

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: icons.user, color: '#1a4a22' },
    { label: 'Active Crops', value: stats?.activeCrops || 0, icon: icons.leaf, color: '#1d4ed8' },
    { label: 'Total Revenue', value: `${((stats?.totalSales || 0) / 1000).toFixed(1)}k RWF`, icon: icons.sales, color: '#b45309' },
    { label: 'Activities', value: stats?.totalActivities || 0, icon: icons.activity, color: '#7c3aed' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              {statCards.map((stat, i) => (
                <div key={i} className="stat-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5a7060' }}>{stat.label}</div>
                    <div style={{ width: 30, height: 30, borderRadius: 7, background: `${stat.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                      <Icon path={stat.icon} size={14} />
                    </div>
                  </div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.9rem', color: '#0d2410', lineHeight: 1 }}>{stat.value}</div>
                </div>
              ))}
            </div>

            <div className="table-container">
              <div className="table-header">Recent System Activity</div>
              <div style={{ padding: '1.25rem' }}>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#5a7060' }}>Loading...</div>
                ) : stats?.recentActivities?.length > 0 ? (
                  stats.recentActivities.map((activity, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem 0', borderBottom: i < stats.recentActivities.length - 1 ? '1px solid #f0ebe0' : 'none' }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: '#f0faf3', border: '1px solid #d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#1a4a22' }}>
                        <Icon path={icons.tasks} size={14} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0d2410' }}>{activity.activityType} - {activity.cropName}</div>
                        <div style={{ fontSize: 11.5, color: '#5a7060', marginTop: 1 }}>{activity.notes || 'No notes'}</div>
                      </div>
                      <div style={{ fontSize: 11, color: '#5a7060' }}>{new Date(activity.activityDate).toLocaleDateString()}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#5a7060' }}>No recent activity</div>
                )}
              </div>
            </div>

            <div className="table-container" style={{ marginTop: '1.5rem' }}>
              <div className="table-header">Recent Users</div>
              <div style={{ padding: '1.25rem' }}>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#5a7060' }}>Loading...</div>
                ) : stats?.recentUsers?.length > 0 ? (
                  stats.recentUsers.map((u, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem 0', borderBottom: i < stats.recentUsers.length - 1 ? '1px solid #f0ebe0' : 'none' }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#f0faf3', border: '1px solid #d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#1a4a22' }}>
                        <Icon path={icons.user} size={14} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0d2410' }}>{u.fullName}</div>
                        <div style={{ fontSize: 11.5, color: '#5a7060', marginTop: 1 }}>{u.email} · {u.farmName || 'No farm'}</div>
                      </div>
                      <div style={{ fontSize: 11, color: '#5a7060' }}>{new Date(u.createdAt).toLocaleDateString()}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#5a7060' }}>No users yet</div>
                )}
              </div>
            </div>
          </>
        );
      case 'users':
        return <AdminUsers notify={notify} />;
      case 'reports':
        return <AdminReports notify={notify} />;
      default:
        return null;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f9f7ef 0%, #edf2e7 52%, #e3ece3 100%)',
      display: 'flex',
      fontFamily: "'DM Sans', sans-serif",
      color: '#0d2410',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        * { box-sizing: border-box; }
        
        .nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 16px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 13.5px;
          font-weight: 500;
          color: rgba(212,175,82,0.7);
          transition: all 0.18s;
          border-right: 2px solid transparent;
          font-family: 'DM Sans', sans-serif;
          text-align: left;
        }
        .nav-item:hover { color: #fff; background: rgba(212,175,82,0.1); }
        .nav-item.active { color: #fff; background: rgba(212,175,82,0.15); border-right-color: #d4af52; }
        
        .stat-card {
          background: #fff;
          border: 1px solid #e8e0d0;
          border-radius: 12px;
          padding: 1.5rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(13,36,16,0.08);
        }
        
        .table-container {
          background: #fff;
          border: 1px solid #e8e0d0;
          border-radius: 12px;
          overflow: hidden;
        }
        
        .table-header {
          background: #f4efe6;
          padding: 0.75rem 1.25rem;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: '#5a7060';
          border-bottom: 1px solid #e8e0d0;
        }
      `}</style>

      <aside style={{
        position: 'fixed', left: 0, top: 0, bottom: 0,
        width: sidebarOpen ? 224 : 60,
        background: 'linear-gradient(180deg, #1a1a0f 0%, #2d2d1a 100%)',
        display: 'flex', flexDirection: 'column',
        zIndex: 50, transition: 'width 0.3s cubic-bezier(0.22,1,0.36,1)',
        overflow: 'hidden',
        borderRight: '1px solid rgba(212,175,82,0.1)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: sidebarOpen ? '1.25rem 1.25rem' : '1.25rem 0',
          justifyContent: sidebarOpen ? 'flex-start' : 'center',
          borderBottom: '1px solid rgba(212,175,82,0.15)',
          flexShrink: 0,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: 'rgba(212,175,82,0.15)',
            border: '1px solid rgba(212,175,82,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon path={icons.leaf} size={16} style={{ color: '#d4af52' }} />
          </div>
          {sidebarOpen && (
            <div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, color: '#fff', lineHeight: 1 }}>Admin Panel</div>
              <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(212,175,82,0.7)', marginTop: 2 }}>AgriTrack Console</div>
            </div>
          )}
        </div>

        <nav style={{ flex: 1, padding: '0.75rem 0', overflowY: 'auto' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              style={{ justifyContent: sidebarOpen ? 'flex-start' : 'center', paddingLeft: sidebarOpen ? 16 : 0 }}
            >
              <Icon path={item.icon} size={17} style={{ flexShrink: 0 }} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid rgba(212,175,82,0.15)', padding: '0.75rem', flexShrink: 0 }}>
          {sidebarOpen ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 10,
              background: 'rgba(212,175,82,0.1)',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(212,175,82,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon path={icons.user} size={14} style={{ color: '#d4af52' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{user?.fullName || 'Admin'}</div>
                <div style={{ fontSize: 10, color: 'rgba(212,175,82,0.7)', marginTop: 1 }}>Administrator</div>
              </div>
              <button onClick={onLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(212,175,82,0.6)', padding: 4 }}>
                <Icon path={icons.logout} size={15} />
              </button>
            </div>
          ) : (
            <button onClick={onLogout} style={{ width: '100%', display: 'flex', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(212,175,82,0.6)', padding: '8px 0' }}>
              <Icon path={icons.logout} size={16} />
            </button>
          )}
        </div>
      </aside>

      <main style={{
        marginLeft: sidebarOpen ? 224 : 60,
        flex: 1, display: 'flex', flexDirection: 'column',
        minHeight: '100vh',
        transition: 'margin-left 0.3s cubic-bezier(0.22,1,0.36,1)',
      }}>
        <header style={{
          position: 'sticky', top: 0, zIndex: 40,
          background: 'linear-gradient(180deg, #1a1a0f 0%, #2d2d1a 100%)',
          borderBottom: '1px solid rgba(212,175,82,0.2)',
          padding: '0 2rem',
          height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setSidebarOpen(s => !s)}
              style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid rgba(212,175,82,0.3)', background: 'rgba(212,175,82,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af52' }}
            >
              <Icon path={icons.menu} size={16} />
            </button>
            <div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: '#f7faf6', fontWeight: 400 }}>
                {navItems.find(n => n.id === activeTab)?.label || 'Overview'}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(212,175,82,0.8)', marginTop: 1 }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
          {/* ADDED SIGN OUT BUTTON */}
          <button 
            onClick={onLogout}
            style={{ 
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(212,175,82,0.1)', 
              border: '1px solid rgba(212,175,82,0.3)', 
              borderRadius: 8,
              padding: '8px 16px',
              cursor: 'pointer',
              color: '#f7faf6',
              fontSize: 13,
              fontWeight: 500
            }}
          >
            <Icon path={icons.logout} size={14} />
            Sign Out
          </button>
        </header>

        <div style={{ flex: 1, padding: '2rem' }}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;