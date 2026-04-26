import { useState, useEffect } from 'react';
import { Icon, icons } from '../components/Icon';
import { cropsAPI, activitiesAPI, healthLogsAPI, inventoryAPI, salesAPI } from '../services/api';

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(6,20,9,0.55)] backdrop-blur-[6px]"
      />
      <div className="relative z-10 bg-white rounded-2xl w-full max-w-[480px] max-h-[90vh] overflow-y-auto border border-[#e8e0d0] shadow-[0_32px_80px_rgba(6,20,9,0.22)]">
        <div className="flex items-center justify-between pt-6 px-7 pb-0 mb-5">
          <h2 className="font-['DM_Serif_Display',serif] text-[1.35rem] text-[#0d2410] font-normal m-0">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-[#e8e0d0] bg-[#f4efe6] cursor-pointer flex items-center justify-center text-[#5a7060] hover:bg-[#e8e0d0] transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="px-7 pb-7">
          {children}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="mb-4">
      <label className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#5a7060] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputSx = "w-full py-3.5 px-4 border border-[#d8e2cd] rounded-[14px] text-sm text-[#122012] bg-[#fbf9f2] outline-none focus:border-[#2d7a3a] focus:shadow-[0_0_0_4px_rgba(46,113,60,0.14)] font-['DM_Sans',sans-serif]";

function Dashboard({ user, onLogout, notify }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [crops, setCrops] = useState([]);
  const [activities, setActivities] = useState([]);
  const [healthLogs, setHealthLogs] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [modals, setModals] = useState({ crop: false, activity: false, health: false, harvest: false, sale: false, detail: false });
  
  const openModal = (k) => setModals(m => ({ ...m, [k]: true }));
  const closeModal = (k) => setModals(m => ({ ...m, [k]: false }));
  
  const [cropForm, setCropForm] = useState({ cropType: 'Maize', plotName: '', plantingDate: '' });
  const [activityForm, setActivityForm] = useState({ cropId: '', activityType: 'Irrigation', activityDate: '', notes: '' });
  const [healthForm, setHealthForm] = useState({ healthStatus: 'Healthy', notes: '' });
  const [harvestForm, setHarvestForm] = useState({ quantity: '', harvestDate: '' });
  const [saleForm, setSaleForm] = useState({ cropType: '', quantity: '', pricePerUnit: '' });

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [cropsRes, activitiesRes, healthLogsRes, inventoryRes, salesRes] = await Promise.all([
        cropsAPI.getAll(),
        activitiesAPI.getAll(),
        healthLogsAPI.getAll(),
        inventoryAPI.getAll(),
        salesAPI.getAll()
      ]);
      
      const transformedCrops = (cropsRes || []).map(c => ({
        ...c,
        name: c.cropType,
        plot: c.plotName
      }));
      
      const transformedActivities = (activitiesRes || []).map(a => ({
        ...a,
        type: a.activityType,
        date: a.activityDate?.split('T')[0],
        cropName: a.cropName || 'Unknown'
      }));
      
      const transformedHealthLogs = (healthLogsRes || []).map(h => ({
        ...h,
        healthStatus: h.healthStatus,
        status: h.healthStatus,
        date: h.logDate?.split('T')[0],
        logDate: h.logDate
      }));
      
      const transformedInventory = (inventoryRes || []).map(i => ({
        ...i,
        totalQty: i.totalQuantity,
        soldQty: i.soldQuantity
      }));
      
      const transformedSales = (salesRes || []).map(s => ({
        ...s,
        qty: s.quantity,
        price: s.pricePerUnit,
        total: s.totalAmount,
        date: s.saleDate?.split('T')[0]
      }));
      
      setCrops(transformedCrops);
      setActivities(transformedActivities);
      setHealthLogs(transformedHealthLogs);
      setInventory(transformedInventory);
      setSales(transformedSales);
    } catch (error) {
      console.error('Load error:', error);
      notify(error.message || 'Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const getCurrentHealth = (cropId) => {
    const logs = healthLogs.filter(l => l.cropId === cropId);
    if (logs.length === 0) return null;
    const sortedLogs = [...logs].sort((a, b) => 
      new Date(b.logDate || b.date) - new Date(a.logDate || a.date)
    );
    return sortedLogs[0] || null;
  };

  const statusMeta = {
    'Planted': { bg: '#fef3c7', color: '#92400e', dot: '#f59e0b' },
    'Growing': { bg: '#dbeafe', color: '#1e40af', dot: '#3b82f6' },
    'Ready for harvest': { bg: '#dcfce7', color: '#166534', dot: '#22c55e' },
    'Harvested': { bg: '#f3e8ff', color: '#6b21a8', dot: '#a855f7' },
  };
  
  const healthMeta = {
    'Healthy': { bg: '#dcfce7', color: '#166534', dot: '#22c55e' },
    'Pest-infected': { bg: '#fee2e2', color: '#991b1b', dot: '#ef4444' },
    'Diseased': { bg: '#ffedd5', color: '#9a3412', dot: '#f97316' },
  };

  const StatusBadge = ({ status, meta }) => {
    const m = meta[status] || { bg: '#f3f4f6', color: '#6b7280', dot: '#9ca3af' };
    return (
      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold py-0.5 px-2.5 rounded-full whitespace-nowrap`}
        style={{ background: m.bg, color: m.color }}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.dot }} />
        {status}
      </span>
    );
  };

  const handleCreateCrop = async () => {
    if (!cropForm.plotName.trim()) { 
      notify('Enter a plot name', 'error'); 
      return; 
    }
    try {
      await cropsAPI.create({
        cropType: cropForm.cropType,
        plotName: cropForm.plotName,
        plantingDate: cropForm.plantingDate || new Date().toISOString().split('T')[0]
      });
      await loadAllData();
      closeModal('crop');
      setCropForm({ cropType: 'Maize', plotName: '', plantingDate: '' });
      notify(`${cropForm.cropType} planted in ${cropForm.plotName}!`);
    } catch (error) {
      notify(error.message || 'Failed to create crop', 'error');
    }
  };

  const handleAddActivity = async () => {
    const cropId = parseInt(activityForm.cropId);
    const crop = crops.find(c => c.id === cropId);
    if (!crop) { 
      notify('Select a crop', 'error'); 
      return; 
    }
    if (crop.status === 'Harvested') { 
      notify('Cannot add activity to harvested crop', 'error'); 
      return; 
    }
    try {
      await cropsAPI.addActivity(crop.id, {
        activityType: activityForm.activityType,
        activityDate: activityForm.activityDate || new Date().toISOString().split('T')[0],
        notes: activityForm.notes
      });
      await loadAllData();
      closeModal('activity');
      setActivityForm({ cropId: '', activityType: 'Irrigation', activityDate: '', notes: '' });
      notify(`${activityForm.activityType} logged for ${crop.name}`);
    } catch (error) {
      notify(error.message || 'Failed to add activity', 'error');
    }
  };

  const handleUpdateHealth = async () => {
    if (!selectedCrop) return;
    try {
      await cropsAPI.addHealthLog(selectedCrop.id, {
        healthStatus: healthForm.healthStatus,
        notes: healthForm.notes,
        logDate: new Date().toISOString().split('T')[0]
      });
      await loadAllData();
      closeModal('health');
      setHealthForm({ healthStatus: 'Healthy', notes: '' });
      notify(`Health updated to ${healthForm.healthStatus}`);
    } catch (error) {
      notify(error.message || 'Failed to update health', 'error');
    }
  };

  const handleHarvest = async () => {
    if (!selectedCrop) return;
    const qty = parseFloat(harvestForm.quantity);
    if (isNaN(qty) || qty <= 0) { 
      notify('Enter valid quantity', 'error'); 
      return; 
    }
    try {
      await inventoryAPI.addHarvest({
        cropId: selectedCrop.id,
        quantity: qty,
        harvestDate: harvestForm.harvestDate || new Date().toISOString().split('T')[0]
      });
      await loadAllData();
      closeModal('harvest');
      setHarvestForm({ quantity: '', harvestDate: '' });
      notify(`Harvested ${qty} kg of ${selectedCrop.name}!`);
    } catch (error) {
      notify(error.message || 'Failed to harvest', 'error');
    }
  };

  const handleSale = async () => {
    const qty = parseFloat(saleForm.quantity);
    const price = parseFloat(saleForm.pricePerUnit);
    if (!saleForm.cropType || isNaN(qty) || qty <= 0 || isNaN(price) || price <= 0) { 
      notify('Fill in all sale fields', 'error'); 
      return; 
    }
    const inv = inventory.find(i => i.cropType === saleForm.cropType);
    const available = inv ? inv.totalQty - inv.soldQty : 0;
    if (available < qty) { 
      notify(`Insufficient stock! Available: ${available} kg`, 'error'); 
      return; 
    }
    try {
      await salesAPI.addSale({
        cropType: saleForm.cropType,
        quantity: qty,
        pricePerUnit: price,
        saleDate: new Date().toISOString().split('T')[0]
      });
      await loadAllData();
      closeModal('sale');
      setSaleForm({ cropType: '', quantity: '', pricePerUnit: '' });
      notify(`Sale recorded: ${qty} kg of ${saleForm.cropType} for ${(qty * price).toLocaleString()} RWF`);
    } catch (error) {
      notify(error.message || 'Failed to record sale', 'error');
    }
  };

  const handleDeleteActivity = async (id) => {
    try {
      await activitiesAPI.delete(id);
      await loadAllData();
      notify('Activity deleted');
    } catch (error) {
      notify(error.message || 'Failed to delete activity', 'error');
    }
  };

  const handleDeleteCrop = async (id) => {
    if (!window.confirm('Delete this crop? This action cannot be undone.')) return;
    try {
      await cropsAPI.delete(id);
      await loadAllData();
      closeModal('detail');
      notify('Crop deleted');
    } catch (error) {
      notify(error.message || 'Failed to delete crop', 'error');
    }
  };

  const activeCrops = crops.filter(c => c.status !== 'Harvested').length;
  const harvestedCrops = crops.filter(c => c.status === 'Harvested').length;
  const totalStock = inventory.reduce((sum, i) => sum + (i.totalQty - i.soldQty), 0);
  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);

  const healthyCrops = crops.filter(c => {
    const health = getCurrentHealth(c.id);
    return health && (health.healthStatus === 'Healthy' || health.status === 'Healthy');
  }).length;
  const pestInfectedCrops = crops.filter(c => {
    const health = getCurrentHealth(c.id);
    return health && (health.healthStatus === 'Pest-infected' || health.status === 'Pest-infected');
  }).length;
  const diseasedCrops = crops.filter(c => {
    const health = getCurrentHealth(c.id);
    return health && (health.healthStatus === 'Diseased' || health.status === 'Diseased');
  }).length;
  const healthScore = crops.length > 0 ? Math.round((healthyCrops / crops.length) * 100) : 0;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: icons.grid },
    { id: 'crops', label: 'Crops', icon: icons.seedling },
    { id: 'activities', label: 'Activities', icon: icons.tasks },
    { id: 'inventory', label: 'Inventory', icon: icons.warehouse },
    { id: 'sales', label: 'Sales', icon: icons.sales },
  ];

  const cardSx = "bg-white border border-[#e8e0d0] rounded-xl p-6";
  const tableTh = "px-5 py-3 text-[10px] font-bold tracking-[0.16em] uppercase text-[#5a7060] text-left bg-[#f4efe6] border-b border-[#e8e0d0]";
  const tableTd = "px-5 py-3.5 text-[13.5px] text-[#1a3020] border-b border-[#f0ebe0] align-middle";
  const btnPrimary = "inline-flex items-center gap-2 bg-[#1a4a22] text-white border-none rounded-lg py-2.5 px-[18px] text-[13px] font-semibold cursor-pointer font-['DM_Sans',sans-serif] whitespace-nowrap hover:bg-[#0d2410] transition-colors";
  const sectionLabel = "text-[10px] font-bold tracking-[0.2em] uppercase text-[#2d7a3a] flex items-center gap-2 mb-1.5";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4efe6]">
        <div className="text-center">
          <div className="text-2xl mb-4">🌱</div>
          <div className="text-[#0d2410]">Loading your farm data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f7ef] via-[#edf2e7] to-[#e3ece3] flex font-['DM_Sans',sans-serif] text-[#0d2410]">
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
          color: rgba(168,224,180,0.6);
          transition: all 0.18s;
          border-right: 2px solid transparent;
          font-family: 'DM Sans', sans-serif;
          text-align: left;
        }
        .nav-item:hover { color: #fff; background: rgba(255,255,255,0.06); }
        .nav-item.active { color: #fff; background: rgba(255,255,255,0.09); border-right-color: #7fcf90; }
        
        .stat-card { transition: transform 0.2s, box-shadow 0.2s; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(13,36,16,0.08); }
        
        .crop-card { transition: all 0.2s; cursor: pointer; }
        .crop-card:hover { border-color: #c4dab7 !important; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(13,36,16,0.07); }
        
        input, select, textarea {
          border-radius: 14px;
          font-family: 'DM Sans', sans-serif;
          background: #fff;
          border: 1px solid #c6d6c1;
          color: #122012;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #2d7a3a !important;
          box-shadow: 0 0 0 4px rgba(46, 113, 60, 0.14);
        }
        .btn-submit {
          width: 100%;
          padding: 13px;
          background: #1a4a22;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          margin-top: 0.5rem;
        }
        .btn-submit:hover { background: #0d2410; }
      `}</style>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 ${sidebarOpen ? 'w-56' : 'w-[60px]'} bg-gradient-to-b from-[#0a1f0f] to-[#1a4a22] flex flex-col z-50 transition-all duration-300 overflow-hidden border-r border-[rgba(255,255,255,0.04)]`}>
        <div className={`flex items-center gap-2.5 ${sidebarOpen ? 'p-5' : 'py-5 px-0 justify-center'} border-b border-[rgba(255,255,255,0.07)] flex-shrink-0`}>
          <div className="w-[34px] h-[34px] rounded-lg bg-[rgba(127,207,144,0.18)] border border-[rgba(127,207,144,0.25)] flex items-center justify-center flex-shrink-0">
            <Icon path={icons.leaf} size={16} style={{ color: '#7fcf90' }} />
          </div>
          {sidebarOpen && (
            <div>
              <div className="font-['DM_Serif_Display',serif] text-base text-white leading-none">AgriTrack</div>
              <div className="text-[9px] tracking-[0.2em] uppercase text-[rgba(127,207,144,0.6)] mt-0.5">Farm Intelligence</div>
            </div>
          )}
        </div>

        <nav className="flex-1 py-3 overflow-y-auto">
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

        <div className="border-t border-[rgba(255,255,255,0.07)] p-3 flex-shrink-0">
          {sidebarOpen ? (
            <div className="flex items-center gap-2.5 py-2.5 px-3 rounded-lg bg-[rgba(255,255,255,0.06)]">
              <div className="w-8 h-8 rounded-full bg-[rgba(127,207,144,0.2)] flex items-center justify-center flex-shrink-0">
                <Icon path={icons.user} size={14} style={{ color: '#7fcf90' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-white">{user?.fullName || 'Farmer'}</div>
                <div className="text-[10px] text-[rgba(127,207,144,0.55)] mt-0.5">{user?.role || 'Farmer'}</div>
              </div>
              <button onClick={onLogout} className="bg-none border-none cursor-pointer text-[rgba(168,224,180,0.5)] p-1 hover:text-white transition-colors">
                <Icon path={icons.logout} size={15} />
              </button>
            </div>
          ) : (
            <button onClick={onLogout} className="w-full flex justify-center bg-none border-none cursor-pointer text-[rgba(168,224,180,0.5)] py-2 hover:text-white transition-colors">
              <Icon path={icons.logout} size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-[60px]'}`}>
        <header className="sticky top-0 z-40 bg-gradient-to-b from-[#0a1f0f] to-[#1a4a22] border-b border-[rgba(255,255,255,0.12)] px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(s => !s)}
              className="w-9 h-9 rounded-lg border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.08)] cursor-pointer flex items-center justify-center text-[#f7faf6] hover:bg-[rgba(255,255,255,0.15)] transition-colors"
            >
              <Icon path={icons.menu} size={16} />
            </button>
            <div>
              <div className="font-['DM_Serif_Display',serif] text-lg text-[#f7faf6] font-normal">
                {activeTab === 'dashboard' ? `Welcome, ${(user?.fullName || 'Farmer').split(' ')[0]}` : navItems.find(n => n.id === activeTab)?.label}
              </div>
              <div className="text-[11px] text-[rgba(255,255,255,0.72)] mt-0.5">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.18)] rounded-lg py-2 px-4 cursor-pointer text-[#f7faf6] text-[13px] font-medium hover:bg-[rgba(255,255,255,0.15)] transition-colors"
          >
            <Icon path={icons.logout} size={14} />
            Sign Out
          </button>
        </header>

        <div className="flex-1 p-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-6">
              {/* Stats Cards Row */}
              <div className="grid grid-cols-5 gap-4">
                {[
                  { label: 'Total Crops', value: crops.length, icon: icons.seedling, accent: '#1a4a22' },
                  { label: 'Active Crops', value: activeCrops, icon: icons.leaf, accent: '#1d4ed8' },
                  { label: 'Harvested', value: harvestedCrops, icon: icons.check, accent: '#7c3aed' },
                  { label: 'Stock (kg)', value: totalStock, icon: icons.box, accent: '#b45309' },
                  { label: 'Revenue', value: `${(totalRevenue/1000).toFixed(1)}k RWF`, icon: icons.sales, accent: '#065f46' },
                ].map((s, i) => (
                  <div key={i} className="stat-card bg-white border border-[#e8e0d0] rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5a7060]">{s.label}</div>
                      <div className={`w-[30px] h-[30px] rounded-[7px] bg-[${s.accent}14] flex items-center justify-center`} style={{ color: s.accent }}>
                        <Icon path={s.icon} size={14} />
                      </div>
                    </div>
                    <div className="font-['DM_Serif_Display',serif] text-[1.9rem] text-[#0d2410] leading-none">{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Farm Health Score Widget */}
              <div className="bg-gradient-to-br from-[#0a1f0f] to-[#1a4a22] border border-[#e8e0d0] rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#7fcf90] mb-3">
                      🌟 Farm Health Score
                    </div>
                    <div className="flex items-baseline gap-4 flex-wrap">
                      <div>
                        <span className="font-['DM_Serif_Display',serif] text-[3.5rem] text-white">{healthScore}%</span>
                        <span className="text-sm text-[#a8e0b4] ml-2">Healthy</span>
                      </div>
                      <div className="w-px h-10 bg-[rgba(255,255,255,0.2)]" />
                      <div>
                        <div className="text-[13px] text-[rgba(255,255,255,0.7)]">🐛 {pestInfectedCrops} need pest control</div>
                        <div className="text-[13px] text-[rgba(255,255,255,0.7)] mt-1">🦠 {diseasedCrops} show disease symptoms</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div 
                      className="w-20 h-20 rounded-full flex items-center justify-center"
                      style={{ background: `conic-gradient(#4caf6f 0deg, #4caf6f ${healthScore * 3.6}deg, rgba(255,255,255,0.15) ${healthScore * 3.6}deg, rgba(255,255,255,0.15) 360deg)` }}
                    >
                      <div className="w-[60px] h-[60px] rounded-full bg-[#0a1f0f] flex items-center justify-center">
                        <Icon path={icons.heart} size={24} style={{ color: '#4caf6f' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-2 gap-5">
                <div className={cardSx}>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <div className={sectionLabel}>Crop Overview</div>
                      <div className="font-['DM_Serif_Display',serif] text-[1.1rem] text-[#0d2410]">Active fields</div>
                    </div>
                  </div>
                  {crops.filter(c => c.status !== 'Harvested').slice(0, 5).map(crop => {
                    const health = getCurrentHealth(crop.id);
                    return (
                      <div key={crop.id} onClick={() => { setSelectedCrop(crop); openModal('detail'); }} className="flex items-center justify-between py-3 px-3.5 rounded-lg cursor-pointer hover:bg-[#f4efe6] transition-colors">
                        <div>
                          <div className="text-sm font-semibold text-[#0d2410]">{crop.name}</div>
                          <div className="text-[11px] text-[#5a7060] mt-0.5">{crop.plot}</div>
                        </div>
                        <div className="flex gap-1.5">
                          <StatusBadge status={crop.status} meta={statusMeta} />
                          {health && <StatusBadge status={health.healthStatus || health.status} meta={healthMeta} />}
                        </div>
                      </div>
                    );
                  })}
                  {crops.filter(c => c.status !== 'Harvested').length === 0 && (
                    <div className="py-8 text-center text-[#5a7060]">No active crops.</div>
                  )}
                </div>

                <div className={cardSx}>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <div className={sectionLabel}>Farm Log</div>
                      <div className="font-['DM_Serif_Display',serif] text-[1.1rem] text-[#0d2410]">Recent activities</div>
                    </div>
                    <button onClick={() => openModal('activity')} className={btnPrimary}>+ Log Activity</button>
                  </div>
                  {activities.slice(0, 5).map((act, i) => (
                    <div key={i} className="flex items-center gap-3 py-3">
                      <div className="w-[34px] h-[34px] rounded-lg bg-[#f0faf3] flex items-center justify-center text-[#1a4a22]">
                        <Icon path={icons.tasks} size={14} />
                      </div>
                      <div className="flex-1">
                        <div className="text-[13.5px] font-semibold">{act.type} — {act.cropName}</div>
                        <div className="text-[11.5px] text-[#5a7060]">{act.notes || 'No notes'}</div>
                      </div>
                      <div className="text-[11px] text-[#5a7060]">{act.date}</div>
                    </div>
                  ))}
                  {activities.length === 0 && <div className="text-center text-[#5a7060] py-8">No activities yet.</div>}
                </div>
              </div>
            </div>
          )}

          {/* Crops Tab */}
          {activeTab === 'crops' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className={sectionLabel}>Fields & Crops</div>
                  <div className="font-['DM_Serif_Display',serif] text-[1.4rem] text-[#0d2410]">{crops.length} crops registered</div>
                </div>
                <button className={btnPrimary} onClick={() => openModal('crop')}>+ Plant New Crop</button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {crops.map(crop => {
                  const health = getCurrentHealth(crop.id);
                  return (
                    <div key={crop.id} className="crop-card bg-white border border-[#e8e0d0] rounded-xl p-5" onClick={() => { setSelectedCrop(crop); openModal('detail'); }}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-[10px] bg-[#f0faf3] flex items-center justify-center text-[#1a4a22]">
                          <Icon path={icons.seedling} size={18} />
                        </div>
                        <StatusBadge status={crop.status} meta={statusMeta} />
                      </div>
                      <div className="font-['DM_Serif_Display',serif] text-[1.1rem] mb-0.5">{crop.name}</div>
                      <div className="text-xs text-[#5a7060] mb-4">{crop.plot} · {crop.plantingDate?.split('T')[0]}</div>
                      <div className="flex items-center justify-between pt-3.5 border-t border-[#f0ebe0]">
                        {health ? <StatusBadge status={health.healthStatus || health.status} meta={healthMeta} /> : <span className="text-[11px] text-[#5a7060]">No health data</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Activities Tab */}
          {activeTab === 'activities' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className={sectionLabel}>Activity Log</div>
                  <div className="font-['DM_Serif_Display',serif] text-[1.4rem] text-[#0d2410]">{activities.length} activities logged</div>
                </div>
                <button className={btnPrimary} onClick={() => openModal('activity')}>+ Log Activity</button>
              </div>
              <div className="bg-white border border-[#e8e0d0] rounded-xl overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className={tableTh}>Crop</th>
                      <th className={tableTh}>Activity</th>
                      <th className={tableTh}>Date</th>
                      <th className={tableTh}>Notes</th>
                      <th className={tableTh}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.sort((a, b) => new Date(b.date) - new Date(a.date)).map(act => (
                      <tr key={act.id}>
                        <td className={`${tableTd} font-semibold`}>{act.cropName}</td>
                        <td className={tableTd}>
                          <span className="bg-[#f0faf3] text-[#1a4a22] py-0.5 px-2.5 rounded-md text-[11px] font-semibold">{act.type}</span>
                        </td>
                        <td className={tableTd}>{act.date}</td>
                        <td className={tableTd}>{act.notes || '—'}</td>
                        <td className={tableTd}>
                          <button onClick={() => handleDeleteActivity(act.id)} className="w-[30px] h-[30px] rounded-md border border-[#e8e0d0] bg-white cursor-pointer text-[#5a7060] hover:bg-[#f4efe6] transition-colors">
                            <Icon path={icons.trash} size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <div>
              <div className="mb-6">
                <div className={sectionLabel}>Harvest Inventory</div>
                <div className="font-['DM_Serif_Display',serif] text-[1.4rem] text-[#0d2410]">{inventory.length} crop types in stock</div>
              </div>
              <div className="bg-white border border-[#e8e0d0] rounded-xl overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className={tableTh}>Crop Type</th>
                      <th className={tableTh}>Total (kg)</th>
                      <th className={tableTh}>Sold (kg)</th>
                      <th className={tableTh}>Available (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map(inv => {
                      const remaining = inv.totalQty - inv.soldQty;
                      return (
                        <tr key={inv.id}>
                          <td className={`${tableTd} font-['DM_Serif_Display',serif] text-[15px]`}>{inv.cropType}</td>
                          <td className={tableTd}>{inv.totalQty}</td>
                          <td className={tableTd}>{inv.soldQty}</td>
                          <td className={`${tableTd} font-bold`}>{remaining}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sales Tab */}
          {activeTab === 'sales' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className={sectionLabel}>Transaction History</div>
                  <div className="font-['DM_Serif_Display',serif] text-[1.4rem] text-[#0d2410]">{sales.length} sales recorded</div>
                </div>
                <button className={btnPrimary} onClick={() => openModal('sale')}>+ Record Sale</button>
              </div>
              <div className="bg-white border border-[#e8e0d0] rounded-xl overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className={tableTh}>Date</th>
                      <th className={tableTh}>Crop</th>
                      <th className={tableTh}>Quantity (kg)</th>
                      <th className={tableTh}>Price/kg</th>
                      <th className={tableTh}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.sort((a, b) => new Date(b.date) - new Date(a.date)).map(sale => (
                      <tr key={sale.id}>
                        <td className={tableTd}>{sale.date}</td>
                        <td className={`${tableTd} font-['DM_Serif_Display',serif]`}>{sale.cropType}</td>
                        <td className={tableTd}>{sale.qty}</td>
                        <td className={tableTd}>{sale.price.toLocaleString()} RWF</td>
                        <td className={`${tableTd} font-bold text-[#1a4a22]`}>{sale.total.toLocaleString()} RWF</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <Modal isOpen={modals.crop} onClose={() => closeModal('crop')} title="Plant New Crop">
        <Field label="Crop Type">
          <select className={inputSx} value={cropForm.cropType} onChange={e => setCropForm({ ...cropForm, cropType: e.target.value })}>
            {['Maize', 'Beans', 'Sorghum', 'Wheat', 'Rice', 'Cassava', 'Sweet Potato'].map(t => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Plot Name">
          <input className={inputSx} placeholder="e.g. North Field A" value={cropForm.plotName} onChange={e => setCropForm({ ...cropForm, plotName: e.target.value })} />
        </Field>
        <Field label="Planting Date">
          <input className={inputSx} type="date" value={cropForm.plantingDate} onChange={e => setCropForm({ ...cropForm, plantingDate: e.target.value })} />
        </Field>
        <button className="btn-submit" onClick={handleCreateCrop}>Plant Crop</button>
      </Modal>

      <Modal isOpen={modals.activity} onClose={() => closeModal('activity')} title="Log Farm Activity">
        <Field label="Select Crop">
          <select className={inputSx} value={activityForm.cropId} onChange={e => setActivityForm({ ...activityForm, cropId: e.target.value })}>
            <option value="">Choose a crop…</option>
            {crops.filter(c => c.status !== 'Harvested').map(c => <option key={c.id} value={c.id}>{c.name} — {c.plot}</option>)}
          </select>
        </Field>
        <Field label="Activity Type">
          <select className={inputSx} value={activityForm.activityType} onChange={e => setActivityForm({ ...activityForm, activityType: e.target.value })}>
            {['Irrigation', 'Fertilization', 'Pest Control', 'Disease Control', 'Weeding', 'Pruning', 'Inspection'].map(t => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Date">
          <input className={inputSx} type="date" value={activityForm.activityDate} onChange={e => setActivityForm({ ...activityForm, activityDate: e.target.value })} />
        </Field>
        <Field label="Notes">
          <textarea className={`${inputSx} resize-none min-h-[80px]`} placeholder="Any observations…" value={activityForm.notes} onChange={e => setActivityForm({ ...activityForm, notes: e.target.value })} />
        </Field>
        <button className="btn-submit" onClick={handleAddActivity}>Log Activity</button>
      </Modal>

      <Modal isOpen={modals.health} onClose={() => closeModal('health')} title={`Update Health — ${selectedCrop?.name || ''}`}>
        <Field label="Health Status">
          <select className={inputSx} value={healthForm.healthStatus} onChange={e => setHealthForm({ ...healthForm, healthStatus: e.target.value })}>
            {['Healthy', 'Pest-infected', 'Diseased'].map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Notes">
          <textarea className={`${inputSx} resize-none min-h-[100px]`} placeholder="Describe what you observed…" value={healthForm.notes} onChange={e => setHealthForm({ ...healthForm, notes: e.target.value })} />
        </Field>
        <button className="btn-submit" onClick={handleUpdateHealth}>Save Health Record</button>
      </Modal>

      <Modal isOpen={modals.harvest} onClose={() => closeModal('harvest')} title={`Harvest — ${selectedCrop?.name || ''}`}>
        <Field label="Quantity (kg)">
          <input className={inputSx} type="number" step="0.1" min="0.1" placeholder="e.g. 250" value={harvestForm.quantity} onChange={e => setHarvestForm({ ...harvestForm, quantity: e.target.value })} />
        </Field>
        <Field label="Harvest Date">
          <input className={inputSx} type="date" value={harvestForm.harvestDate} onChange={e => setHarvestForm({ ...harvestForm, harvestDate: e.target.value })} />
        </Field>
        <button className="btn-submit" onClick={handleHarvest}>Confirm Harvest</button>
      </Modal>

      <Modal isOpen={modals.sale} onClose={() => closeModal('sale')} title="Record Sale">
        <Field label="Crop">
          <select className={inputSx} value={saleForm.cropType} onChange={e => setSaleForm({ ...saleForm, cropType: e.target.value })}>
            <option value="">Choose a crop…</option>
            {inventory.map(i => <option key={i.id} value={i.cropType}>{i.cropType} — {i.totalQty - i.soldQty} kg available</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Quantity (kg)">
            <input className={inputSx} type="number" step="0.1" min="0.1" value={saleForm.quantity} onChange={e => setSaleForm({ ...saleForm, quantity: e.target.value })} />
          </Field>
          <Field label="Price per kg (RWF)">
            <input className={inputSx} type="number" step="1" min="0" value={saleForm.pricePerUnit} onChange={e => setSaleForm({ ...saleForm, pricePerUnit: e.target.value })} />
          </Field>
        </div>
        {saleForm.quantity && saleForm.pricePerUnit && (
          <div className="bg-[#f0faf3] p-4 rounded-lg mb-4">
            <div className="text-[11px] font-semibold text-[#5a7060]">Sale Total</div>
            <div className="font-['DM_Serif_Display',serif] text-[1.6rem] text-[#1a4a22]">
              {(parseFloat(saleForm.quantity) * parseFloat(saleForm.pricePerUnit)).toLocaleString()} RWF
            </div>
          </div>
        )}
        <button className="btn-submit" onClick={handleSale}>Record Sale</button>
      </Modal>

      <Modal isOpen={modals.detail} onClose={() => closeModal('detail')} title={selectedCrop?.name || ''}>
        {selectedCrop && (() => {
          const crop = crops.find(c => c.id === selectedCrop.id);
          if (!crop) return null;
          const health = getCurrentHealth(crop.id);
          const cropLogs = healthLogs.filter(h => h.cropId === crop.id).sort((a, b) => new Date(b.logDate || b.date) - new Date(a.logDate || a.date));
          const cropActs = activities.filter(a => a.cropId === crop.id).sort((a, b) => new Date(b.date) - new Date(a.date));
          return (
            <div>
              <div className="grid grid-cols-2 gap-2 mb-5">
                <div className="bg-[#f4efe6] rounded-lg py-3 px-4">
                  <div className="text-[10px] font-bold text-[#5a7060] mb-1.5">Plot</div>
                  <div className="text-[13.5px] font-semibold">{crop.plot}</div>
                </div>
                <div className="bg-[#f4efe6] rounded-lg py-3 px-4">
                  <div className="text-[10px] font-bold text-[#5a7060] mb-1.5">Planted</div>
                  <div className="text-[13.5px] font-semibold">{crop.plantingDate?.split('T')[0]}</div>
                </div>
                <div className="bg-[#f4efe6] rounded-lg py-3 px-4">
                  <div className="text-[10px] font-bold text-[#5a7060] mb-1.5">Status</div>
                  <StatusBadge status={crop.status} meta={statusMeta} />
                </div>
                <div className="bg-[#f4efe6] rounded-lg py-3 px-4">
                  <div className="text-[10px] font-bold text-[#5a7060] mb-1.5">Health</div>
                  {health ? <StatusBadge status={health.healthStatus || health.status} meta={healthMeta} /> : <span className="text-xs text-[#5a7060]">Not recorded</span>}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap mb-6">
                <button onClick={() => { closeModal('detail'); openModal('health'); }} className="bg-[#f0faf3] text-[#1a4a22] border-none py-2 px-4 rounded-lg cursor-pointer hover:bg-[#e0f0e3] transition-colors">Update Health</button>
                {crop.status !== 'Harvested' && (
                  <button onClick={() => { closeModal('detail'); openModal('harvest'); }} className="bg-[#f3e8ff] text-[#6b21a8] border-none py-2 px-4 rounded-lg cursor-pointer hover:bg-[#e8d5ff] transition-colors">Harvest</button>
                )}
                <button onClick={() => handleDeleteCrop(crop.id)} className="bg-[#fee2e2] text-[#991b1b] border-none py-2 px-4 rounded-lg cursor-pointer ml-auto hover:bg-[#fecaca] transition-colors">Delete</button>
              </div>
              
              {/* Health History */}
              <div className="mb-5">
                <div className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#5a7060] mb-1.5">Health History</div>
                <div className="max-h-[130px] overflow-y-auto">
                  {cropLogs.length === 0 ? (
                    <div className="text-xs text-[#5a7060]">No health records yet.</div>
                  ) : (
                    cropLogs.slice(0, 5).map((log, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-[11px] py-1">
                        <span className="text-[#5a7060] w-[75px]">{log.logDate?.split('T')[0] || log.date}</span>
                        <StatusBadge status={log.healthStatus || log.status} meta={healthMeta} />
                        <span className="text-[#5a7060] flex-1">{log.notes || '—'}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {/* Activity History */}
              <div>
                <div className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#5a7060] mb-1.5">Activity History</div>
                <div className="max-h-[130px] overflow-y-auto">
                  {cropActs.length === 0 ? (
                    <div className="text-xs text-[#5a7060]">No activities recorded.</div>
                  ) : (
                    cropActs.slice(0, 5).map((act, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-[11px] py-1">
                        <span className="text-[#5a7060] w-[75px]">{act.date}</span>
                        <span className="bg-[#f0faf3] text-[#1a4a22] py-0.5 px-2 rounded-[5px] text-[10px] font-semibold">{act.type}</span>
                        <span className="text-[#5a7060] flex-1">{act.notes || '—'}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}

export default Dashboard;