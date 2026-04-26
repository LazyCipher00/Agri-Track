import { useState, useEffect } from 'react';
import { Icon, icons } from '../components/Icon';
import { adminAPI } from '../services/api';

function AdminUsers({ notify }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const pageSize = 20;

  useEffect(() => {
    loadUsers();
  }, [page]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getUsers(page, pageSize);
      setUsers(data.users);
      setTotalCount(data.totalCount);
    } catch (error) {
      notify('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await adminAPI.toggleUserStatus(userId);
      notify('User status updated successfully', 'success');
      loadUsers();
    } catch (error) {
      notify(error.message || 'Failed to update user status', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      await adminAPI.deleteUser(userId);
      notify('User deleted successfully', 'success');
      loadUsers();
    } catch (error) {
      notify(error.message || 'Failed to delete user', 'error');
    }
  };

  const handleMakeAdmin = async (userId) => {
    if (!window.confirm('Promote this user to admin?')) {
      return;
    }
    
    try {
      await adminAPI.makeAdmin(userId);
      notify('User promoted to admin successfully', 'success');
      loadUsers();
    } catch (error) {
      notify(error.message || 'Failed to promote user', 'error');
    }
  };

  const handleViewDetails = async (userId) => {
    try {
      const userData = await adminAPI.getUser(userId);
      setSelectedUser(userData);
      setShowDetailModal(true);
    } catch (error) {
      notify('Failed to load user details', 'error');
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div>
      <style>{`
        .user-table {
          width: 100%;
          border-collapse: collapse;
        }
        .user-table th {
          padding: 0.75rem 1rem;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #5a7060;
          text-align: left;
          background: #f4efe6;
          border-bottom: 1px solid #e8e0d0;
        }
        .user-table td {
          padding: 0.85rem 1rem;
          font-size: 13.5px;
          color: #1a3020;
          border-bottom: 1px solid #f0ebe0;
        }
        .user-table tr:hover {
          background: #f7fbf4;
        }
        .action-btn {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          margin-right: 6px;
          transition: all 0.15s;
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }
        .modal-content {
          background: #fff;
          border-radius: 12px;
          padding: 2rem;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }
      `}</style>

      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', color: '#0d2410', marginBottom: '0.5rem' }}>
          User Management
        </h2>
        <p style={{ fontSize: 14, color: '#5a7060' }}>
          Manage all registered users and their permissions
        </p>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e8e0d0', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#5a7060' }}>Loading users...</div>
        ) : (
          <>
            <table className="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Farm</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td style={{ fontWeight: 600 }}>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.farmName || 'N/A'}</td>
                    <td>
                      <span style={{
                        background: user.role === 'Admin' ? '#fef3c7' : '#dbeafe',
                        color: user.role === 'Admin' ? '#92400e' : '#1e40af',
                        padding: '3px 10px',
                        borderRadius: 100,
                        fontSize: 11,
                        fontWeight: 600
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        color: user.isActive ? '#166534' : '#991b1b',
                        background: user.isActive ? '#dcfce7' : '#fee2e2',
                        padding: '3px 10px',
                        borderRadius: 100,
                        fontSize: 11,
                        fontWeight: 600
                      }}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="action-btn"
                        style={{ background: '#f0faf3', color: '#1a4a22' }}
                        onClick={() => handleViewDetails(user.id)}
                      >
                        View
                      </button>
                      <button
                        className="action-btn"
                        style={{ background: user.isActive ? '#fee2e2' : '#dcfce7', color: user.isActive ? '#991b1b' : '#166534' }}
                        onClick={() => handleToggleStatus(user.id)}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      {user.role !== 'Admin' && (
                        <>
                          <button
                            className="action-btn"
                            style={{ background: '#fef3c7', color: '#92400e' }}
                            onClick={() => handleMakeAdmin(user.id)}
                          >
                            Make Admin
                          </button>
                          <button
                            className="action-btn"
                            style={{ background: '#fee2e2', color: '#991b1b' }}
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center', gap: 8, borderTop: '1px solid #e8e0d0' }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #e8e0d0',
                  background: '#fff',
                  borderRadius: 6,
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                  opacity: page === 1 ? 0.5 : 1
                }}
              >
                Previous
              </button>
              <span style={{ padding: '8px 16px', color: '#5a7060' }}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #e8e0d0',
                  background: '#fff',
                  borderRadius: 6,
                  cursor: page === totalPages ? 'not-allowed' : 'pointer',
                  opacity: page === totalPages ? 0.5 : 1
                }}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* User Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', color: '#0d2410' }}>
                User Details
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <p><strong>Name:</strong> {selectedUser.fullName}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Farm:</strong> {selectedUser.farmName || 'N/A'}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Status:</strong> {selectedUser.isActive ? 'Active' : 'Inactive'}</p>
              <p><strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
              <p><strong>Last Login:</strong> {selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleString() : 'Never'}</p>
              <p><strong>Total Crops:</strong> {selectedUser.cropCount}</p>
              <p><strong>Total Sales:</strong> {selectedUser.salesTotal.toLocaleString()} RWF</p>
            </div>

            {selectedUser.recentCrops && selectedUser.recentCrops.length > 0 && (
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: '0.75rem' }}>Recent Crops</h4>
                {selectedUser.recentCrops.map(crop => (
                  <div key={crop.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #f0ebe0' }}>
                    <div><strong>{crop.cropType}</strong> - {crop.plotName}</div>
                    <div style={{ fontSize: 12, color: '#5a7060' }}>
                      Planted: {new Date(crop.plantingDate).toLocaleDateString()} | Status: {crop.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;