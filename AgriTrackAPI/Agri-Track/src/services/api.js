const API_BASE_URL = 'http://localhost:5241/api';

// Helper function for API calls
async function apiCall(endpoint, options = {}, isBlob = false) {
    const token = localStorage.getItem('token');
    
    const headers = {
        ...options.headers
    };
    
    if (!(options.body instanceof FormData) && !isBlob) {
        headers['Content-Type'] = 'application/json';
    }
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });
        
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
            throw new Error('Session expired. Please login again.');
        }
        
        if (!response.ok) {
            let errorMessage = 'API call failed';
            try {
                const error = await response.json();
                errorMessage = error.message || error.title || 'API call failed';
            } catch (e) {
                errorMessage = response.statusText || 'API call failed';
            }
            throw new Error(errorMessage);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && (
            contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') ||
            contentType.includes('application/vnd.ms-excel') ||
            contentType.includes('application/octet-stream')
        )) {
            return response.blob();
        }
        
        const text = await response.text();
        if (!text) return null;
        
        try {
            return JSON.parse(text);
        } catch (e) {
            return text;
        }
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Auth APIs
export const authAPI = {
    login: (data) => apiCall('/Auth/login', { method: 'POST', body: JSON.stringify(data) }),
    register: (data) => apiCall('/Auth/register', { method: 'POST', body: JSON.stringify(data) }),
    verifyOTP: (data) => apiCall('/Auth/verify-otp', { method: 'POST', body: JSON.stringify(data) }),
    requestPasswordReset: (email) => apiCall('/Auth/request-password-reset', { method: 'POST', body: JSON.stringify({ email }) }),
    resetPassword: (data) => apiCall('/Auth/reset-password', { method: 'POST', body: JSON.stringify(data) }),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

// Admin APIs
export const adminAPI = {
    getDashboardStats: () => apiCall('/Admin/dashboard-stats'),
    getUsers: (page = 1, pageSize = 20) => apiCall(`/Admin/users?page=${page}&pageSize=${pageSize}`),
    getUser: (id) => apiCall(`/Admin/users/${id}`),
    toggleUserStatus: (id) => apiCall(`/Admin/users/${id}/toggle-status`, { method: 'PUT' }),
    deleteUser: (id) => apiCall(`/Admin/users/${id}`, { method: 'DELETE' }),
    makeAdmin: (id) => apiCall(`/Admin/users/${id}/make-admin`, { method: 'PUT' }),
    getAuditLogs: (page = 1, pageSize = 50) => apiCall(`/Admin/audit-logs?page=${page}&pageSize=${pageSize}`),
    getSystemStats: () => apiCall('/Admin/system-stats'),
    createAdmin: (data) => apiCall('/Admin/create-admin', { method: 'POST', body: JSON.stringify(data) })
};

// OTP APIs
export const otpAPI = {
    send: (email, purpose = 'Login') => apiCall('/OTP/send', { method: 'POST', body: JSON.stringify({ email, purpose }) }),
    verify: (email, otpCode, purpose = 'Login') => apiCall('/OTP/verify', { method: 'POST', body: JSON.stringify({ email, otpCode, purpose }) }),
    resend: (email, purpose = 'Login') => apiCall('/OTP/resend', { method: 'POST', body: JSON.stringify({ email, purpose }) })
};

// Reports APIs
export const reportsAPI = {
    getMonthlyReport: (year, month) => apiCall(`/Reports/monthly/${year}/${month}`, {}, true),
    getAnnualReport: (year) => apiCall(`/Reports/annual/${year}`, {}, true),
    getUserReport: () => apiCall('/Reports/users', {}, true),
    getMyFarmReport: () => apiCall('/Reports/my-farm', {}, true)
};

// Crops APIs
export const cropsAPI = {
    getAll: () => apiCall('/Crops'),
    get: (id) => apiCall(`/Crops/${id}`),
    create: (data) => apiCall('/Crops', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiCall(`/Crops/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiCall(`/Crops/${id}`, { method: 'DELETE' }),
    addActivity: (cropId, data) => apiCall(`/Crops/${cropId}/activities`, { method: 'POST', body: JSON.stringify(data) }),
    addHealthLog: (cropId, data) => apiCall(`/Crops/${cropId}/health-logs`, { method: 'POST', body: JSON.stringify(data) })
};

// Activities APIs
export const activitiesAPI = {
    getAll: () => apiCall('/Activities'),
    delete: (id) => apiCall(`/Activities/${id}`, { method: 'DELETE' })
};

// Health Logs APIs
export const healthLogsAPI = {
    getAll: () => apiCall('/HealthLogs'),
    getByCrop: (cropId) => apiCall(`/HealthLogs/crop/${cropId}`),
    delete: (id) => apiCall(`/HealthLogs/${id}`, { method: 'DELETE' })
};

// Inventory APIs
export const inventoryAPI = {
    getAll: () => apiCall('/Inventory'),
    addHarvest: (data) => apiCall('/Inventory/harvest', { method: 'POST', body: JSON.stringify(data) })
};

// Sales APIs
export const salesAPI = {
    getAll: () => apiCall('/Sales'),
    getStats: () => apiCall('/Sales/stats'),
    addSale: (data) => apiCall('/Inventory/sale', { method: 'POST', body: JSON.stringify(data) }),
    updateSale: (id, data) => apiCall(`/Sales/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteSale: (id) => apiCall(`/Sales/${id}`, { method: 'DELETE' })
};

// Dashboard APIs
export const dashboardAPI = {
    getStats: () => apiCall('/Dashboard/stats'),
    getRecentActivities: (limit = 10) => apiCall(`/Dashboard/recent-activities?limit=${limit}`),
    getInventorySummary: () => apiCall('/Dashboard/inventory-summary')
};

// Health check
export const healthAPI = {
    check: () => apiCall('/Health'),
    checkDatabase: () => apiCall('/Health/database'),
    debug: () => apiCall('/Health/debug')
};

// Utility functions
export const isAuthenticated = () => !!localStorage.getItem('token');

export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
};

export const isAdmin = () => {
    const user = getCurrentUser();
    return user?.role === 'Admin';
};

export const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
};

export default {
    auth: authAPI,
    admin: adminAPI,
    otp: otpAPI,
    reports: reportsAPI,
    crops: cropsAPI,
    activities: activitiesAPI,
    healthLogs: healthLogsAPI,
    inventory: inventoryAPI,
    sales: salesAPI,
    dashboard: dashboardAPI,
    health: healthAPI,
    utils: { isAuthenticated, getCurrentUser, isAdmin, downloadFile }
};