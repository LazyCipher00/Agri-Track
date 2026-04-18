import { useState } from 'react';
import { Icon, icons } from '../components/Icon';

// ─── Inline Modal (fully custom, no external dependency needed) ───────────────
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(6, 20, 9, 0.55)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      />
      {/* Panel */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: '#fff',
        borderRadius: 16,
        width: '100%', maxWidth: 480,
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '1px solid #e8e0d0',
        boxShadow: '0 32px 80px rgba(6,20,9,0.22)',
        animation: 'modalIn 0.28s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {/* Modal header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.5rem 1.75rem 0',
          marginBottom: '1.25rem',
        }}>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: '1.35rem',
            color: '#0d2410',
            fontWeight: 400,
            margin: 0,
          }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8,
              border: '1px solid #e8e0d0',
              background: '#f4efe6',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#5a7060',
              fontSize: 16, lineHeight: 1,
              transition: 'all 0.15s',
            }}
          >✕</button>
        </div>
        <div style={{ padding: '0 1.75rem 1.75rem' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Field component ─────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{
        display: 'block',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: '#5a7060',
        marginBottom: '0.45rem',
      }}>{label}</label>
      {children}
    </div>
  );
}

const inputSx = {
  width: '100%',
  padding: '14px 16px',
  border: '1px solid #d8e2cd',
  borderRadius: 14,
  fontSize: 14,
  color: '#122012',
  background: '#fbf9f2',
  outline: 'none',
  fontFamily: "'DM Sans', sans-serif",
  lineHeight: 1.6,
  boxShadow: 'inset 0 1px 2px rgba(15, 23, 17, 0.04)',
  transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ user, onLogout, notify }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [crops, setCrops] = useState([
    { id: 1, name: 'Maize', plot: 'North Field A', plantingDate: '2026-02-15', status: 'Growing' },
    { id: 2, name: 'Beans', plot: 'East Field B', plantingDate: '2026-02-20', status: 'Planted' },
    { id: 3, name: 'Sorghum', plot: 'West Field C', plantingDate: '2026-01-10', status: 'Ready for harvest' },
  ]);
  const [activities, setActivities] = useState([
    { id: 1, cropId: 1, cropName: 'Maize', type: 'Irrigation', date: '2026-02-18', notes: 'Regular watering' },
    { id: 2, cropId: 1, cropName: 'Maize', type: 'Fertilization', date: '2026-02-25', notes: 'Applied organic fertilizer' },
    { id: 3, cropId: 3, cropName: 'Sorghum', type: 'Pest Control', date: '2026-02-22', notes: 'Applied pesticide' },
  ]);
  const [healthLogs, setHealthLogs] = useState([
    { id: 1, cropId: 1, status: 'Healthy', notes: 'Good growth', date: '2026-02-20' },
    { id: 2, cropId: 2, status: 'Healthy', notes: 'Germination successful', date: '2026-02-25' },
    { id: 3, cropId: 3, status: 'Pest-infected', notes: 'Minor aphid infestation detected', date: '2026-02-22' },
  ]);
  const [inventory, setInventory] = useState([
    { id: 1, cropType: 'Maize', totalQty: 500, soldQty: 50 },
    { id: 2, cropType: 'Beans', totalQty: 200, soldQty: 0 },
  ]);
  const [sales, setSales] = useState([
    { id: 1, date: '2026-03-15', cropType: 'Maize', qty: 50, price: 800, total: 40000 },
  ]);
  const [nextId, setNextId] = useState(200);
  const [selectedCrop, setSelectedCrop] = useState(null);

  const [modals, setModals] = useState({ crop: false, activity: false, health: false, harvest: false, sale: false, detail: false });
  const openModal = k => setModals(m => ({ ...m, [k]: true }));
  const closeModal = k => setModals(m => ({ ...m, [k]: false }));

  const [cropForm, setCropForm] = useState({ type: 'Maize', plot: '', date: '' });
  const [activityForm, setActivityForm] = useState({ cropId: '', type: 'Irrigation', date: '', notes: '' });
  const [healthForm, setHealthForm] = useState({ status: 'Healthy', notes: '' });
  const [harvestForm, setHarvestForm] = useState({ qty: '', date: '' });
  const [saleForm, setSaleForm] = useState({ cropType: '', qty: '', price: '' });

  const nid = () => { setNextId(n => n + 1); return nextId; };

  const getCurrentHealth = (cropId) => {
    const logs = healthLogs.filter(l => l.cropId === cropId).sort((a, b) => new Date(b.date) - new Date(a.date));
    return logs[0] || null;
  };
  const updateStock = (inv, sl) => inv.map(i => ({ ...i, soldQty: sl.filter(s => s.cropType === i.cropType).reduce((sum, s) => sum + s.qty, 0) }));

  const statusMeta = {
    'Planted':          { bg: '#fef3c7', color: '#92400e', dot: '#f59e0b' },
    'Growing':          { bg: '#dbeafe', color: '#1e40af', dot: '#3b82f6' },
    'Ready for harvest':{ bg: '#dcfce7', color: '#166534', dot: '#22c55e' },
    'Harvested':        { bg: '#f3e8ff', color: '#6b21a8', dot: '#a855f7' },
  };
  const healthMeta = {
    'Healthy':      { bg: '#dcfce7', color: '#166534', dot: '#22c55e' },
    'Pest-infected':{ bg: '#fee2e2', color: '#991b1b', dot: '#ef4444' },
    'Diseased':     { bg: '#ffedd5', color: '#9a3412', dot: '#f97316' },
  };

  const StatusBadge = ({ status, meta }) => {
    const m = meta[status] || { bg: '#f3f4f6', color: '#6b7280', dot: '#9ca3af' };
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        background: m.bg, color: m.color,
        fontSize: 11, fontWeight: 600,
        padding: '3px 10px', borderRadius: 100,
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
      }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: m.dot, flexShrink: 0 }} />
        {status}
      </span>
    );
  };

  // Handlers
  const handleCreateCrop = () => {
    if (!cropForm.plot.trim()) { notify?.('Enter a plot name', 'error'); return; }
    const id = nid();
    const newCrop = { id, name: cropForm.type, plot: cropForm.plot, plantingDate: cropForm.date || new Date().toISOString().slice(0, 10), status: 'Planted' };
    setCrops(c => [...c, newCrop]);
    setActivities(a => [...a, { id: nid(), cropId: id, cropName: cropForm.type, type: 'Planting', date: newCrop.plantingDate, notes: `Planted in ${cropForm.plot}` }]);
    setHealthLogs(h => [...h, { id: nid(), cropId: id, status: 'Healthy', notes: 'New crop planted', date: newCrop.plantingDate }]);
    closeModal('crop');
    setCropForm({ type: 'Maize', plot: '', date: '' });
    notify?.(`${cropForm.type} planted in ${cropForm.plot}!`);
  };

  const handleAddActivity = () => {
    const crop = crops.find(c => c.id === parseInt(activityForm.cropId));
    if (!crop) { notify?.('Select a crop', 'error'); return; }
    if (crop.status === 'Harvested') { notify?.('Cannot add activity to harvested crop', 'error'); return; }
    const date = activityForm.date || new Date().toISOString().slice(0, 10);
    setActivities(a => [...a, { id: nid(), cropId: crop.id, cropName: crop.name, type: activityForm.type, date, notes: activityForm.notes }]);
    closeModal('activity');
    setActivityForm({ cropId: '', type: 'Irrigation', date: '', notes: '' });
    notify?.(`${activityForm.type} logged for ${crop.name}`);
  };

  const handleUpdateHealth = () => {
    if (!selectedCrop) return;
    const date = new Date().toISOString().slice(0, 10);
    setHealthLogs(h => [...h, { id: nid(), cropId: selectedCrop.id, status: healthForm.status, notes: healthForm.notes, date }]);
    setActivities(a => [...a, { id: nid(), cropId: selectedCrop.id, cropName: selectedCrop.name, type: 'Health Check', date, notes: `${healthForm.status} — ${healthForm.notes}` }]);
    closeModal('health');
    setHealthForm({ status: 'Healthy', notes: '' });
    notify?.(`Health updated to ${healthForm.status}`);
  };

  const handleHarvest = () => {
    if (!selectedCrop) return;
    const qty = parseFloat(harvestForm.qty);
    if (isNaN(qty) || qty <= 0) { notify?.('Enter valid quantity', 'error'); return; }
    const date = harvestForm.date || new Date().toISOString().slice(0, 10);
    setCrops(c => c.map(cr => cr.id === selectedCrop.id ? { ...cr, status: 'Harvested' } : cr));
    setActivities(a => [...a, { id: nid(), cropId: selectedCrop.id, cropName: selectedCrop.name, type: 'Harvest', date, notes: `Harvested ${qty} kg` }]);
    setInventory(inv => {
      const ex = inv.find(i => i.cropType === selectedCrop.name);
      if (ex) return inv.map(i => i.cropType === selectedCrop.name ? { ...i, totalQty: i.totalQty + qty } : i);
      return [...inv, { id: nid(), cropType: selectedCrop.name, totalQty: qty, soldQty: 0 }];
    });
    closeModal('harvest');
    setHarvestForm({ qty: '', date: '' });
    notify?.(`Harvested ${qty} kg of ${selectedCrop.name}!`);
  };

  const handleSale = () => {
    const qty = parseFloat(saleForm.qty);
    const price = parseFloat(saleForm.price);
    if (!saleForm.cropType || isNaN(qty) || qty <= 0 || isNaN(price) || price <= 0) { notify?.('Fill in all sale fields', 'error'); return; }
    const inv = inventory.find(i => i.cropType === saleForm.cropType);
    const available = inv ? inv.totalQty - inv.soldQty : 0;
    if (available < qty) { notify?.(`Insufficient stock! Available: ${available} kg`, 'error'); return; }
    const newSales = [...sales, { id: nid(), date: new Date().toISOString().slice(0, 10), cropType: saleForm.cropType, qty, price, total: qty * price }];
    setSales(newSales);
    setInventory(i => updateStock(i, newSales));
    closeModal('sale');
    setSaleForm({ cropType: '', qty: '', price: '' });
    notify?.(`Sale recorded: ${qty} kg of ${saleForm.cropType} for ${(qty * price).toLocaleString()} RWF`);
  };

  const handleDeleteCrop = (id) => {
    setCrops(c => c.filter(cr => cr.id !== id));
    setActivities(a => a.filter(ac => ac.cropId !== id));
    setHealthLogs(h => h.filter(hl => hl.cropId !== id));
    closeModal('detail');
    notify?.('Crop deleted');
  };

  // Computed
  const activeCrops = crops.filter(c => c.status !== 'Harvested').length;
  const harvestedCrops = crops.filter(c => c.status === 'Harvested').length;
  const totalStock = inventory.reduce((sum, i) => sum + (i.totalQty - i.soldQty), 0);
  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: icons.grid },
    { id: 'crops',     label: 'Crops',     icon: icons.seedling },
    { id: 'activities',label: 'Activities',icon: icons.tasks },
    { id: 'inventory', label: 'Inventory', icon: icons.warehouse },
    { id: 'sales',     label: 'Sales',     icon: icons.sales },
  ];

  // Shared styles
  const cardSx = {
    background: '#fff',
    border: '1px solid #e8e0d0',
    borderRadius: 12,
    padding: '1.5rem',
  };
  const tableTh = {
    padding: '0.75rem 1.25rem',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: '#5a7060',
    textAlign: 'left',
    background: '#f4efe6',
    borderBottom: '1px solid #e8e0d0',
  };
  const tableTd = {
    padding: '0.85rem 1.25rem',
    fontSize: 13.5,
    color: '#1a3020',
    borderBottom: '1px solid #f0ebe0',
    verticalAlign: 'middle',
  };
  const btnPrimary = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: '#1a4a22', color: '#fff',
    border: 'none', borderRadius: 8,
    padding: '10px 18px',
    fontSize: 13, fontWeight: 600,
    cursor: 'pointer', letterSpacing: '0.04em',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'background 0.2s',
    whiteSpace: 'nowrap',
  };
  const btnGhost = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: 'transparent', color: '#5a7060',
    border: '1px solid #e8e0d0', borderRadius: 8,
    padding: '8px 14px',
    fontSize: 12, fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.2s',
  };
  const sectionLabel = {
    fontSize: 10, fontWeight: 700, letterSpacing: '0.2em',
    textTransform: 'uppercase', color: '#2d7a3a',
    display: 'flex', alignItems: 'center', gap: 8,
    marginBottom: '0.6rem',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f9f7ef 0%, #edf2e7 52%, #e3ece3 100%)',
      backgroundImage: 'radial-gradient(circle at top left, rgba(77, 136, 82, 0.08), transparent 20%), radial-gradient(circle at bottom right, rgba(46, 113, 60, 0.10), transparent 18%)',
      display: 'flex',
      fontFamily: "'DM Sans', sans-serif",
      color: '#0d2410',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #c4dab7; border-radius: 4px; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }

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
          border-radius: 0;
          letter-spacing: 0.01em;
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
          box-shadow: inset 0 1px 2px rgba(13, 36, 16, 0.06);
        }
        input::placeholder, textarea::placeholder {
          color: rgba(13,36,16,0.5);
        }
        select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background: #fff;
          background-image: linear-gradient(45deg, transparent 50%, rgba(13,36,16,0.45) 50%), linear-gradient(135deg, rgba(13,36,16,0.45) 50%, transparent 50%);
          background-position: calc(100% - 1rem) center, calc(100% - 0.75rem) center;
          background-size: 7px 7px;
          background-repeat: no-repeat;
          padding-right: 2.7rem;
          color: #122012;
        }
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #2d7a3a !important;
          box-shadow: 0 0 0 4px rgba(46, 113, 60, 0.14);
          background: #fff !important;
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
          letter-spacing: 0.04em;
          transition: background 0.2s;
          margin-top: 0.5rem;
        }
        .btn-submit:hover { background: #0d2410; }

        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          padding: 7px 13px;
          border-radius: 7px;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.15s;
          letter-spacing: 0.02em;
        }

        tr:last-child td { border-bottom: none !important; }
      `}</style>

      {/* ── Sidebar ── */}
      <aside style={{
        position: 'fixed', left: 0, top: 0, bottom: 0,
        width: sidebarOpen ? 224 : 60,
        background: 'linear-gradient(180deg, #0a1f0f 0%, #1a4a22 100%)',
        display: 'flex', flexDirection: 'column',
        zIndex: 50, transition: 'width 0.3s cubic-bezier(0.22,1,0.36,1)',
        overflow: 'hidden',
        borderRight: '1px solid rgba(255,255,255,0.04)',
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: sidebarOpen ? '1.25rem 1.25rem' : '1.25rem 0',
          justifyContent: sidebarOpen ? 'flex-start' : 'center',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: 'rgba(127,207,144,0.18)',
            border: '1px solid rgba(127,207,144,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon path={icons.leaf} size={16} style={{ color: '#7fcf90' }} />
          </div>
          {sidebarOpen && (
            <div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, color: '#fff', lineHeight: 1 }}>AgriTrack</div>
              <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(127,207,144,0.6)', marginTop: 2 }}>Farm Intelligence</div>
            </div>
          )}
        </div>

        {/* Nav */}
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

        {/* User block */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '0.75rem', flexShrink: 0 }}>
          {sidebarOpen ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 10,
              background: 'rgba(255,255,255,0.06)',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(127,207,144,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon path={icons.user} size={14} style={{ color: '#7fcf90' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'Farmer'}</div>
                <div style={{ fontSize: 10, color: 'rgba(127,207,144,0.55)', marginTop: 1 }}>{user?.role || 'Farm Manager'}</div>
              </div>
              <button onClick={onLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(168,224,180,0.5)', padding: 4, transition: 'color 0.2s' }}>
                <Icon path={icons.logout} size={15} />
              </button>
            </div>
          ) : (
            <button onClick={onLogout} style={{ width: '100%', display: 'flex', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(168,224,180,0.5)', padding: '8px 0' }}>
              <Icon path={icons.logout} size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{
        marginLeft: sidebarOpen ? 224 : 60,
        flex: 1, display: 'flex', flexDirection: 'column',
        minHeight: '100vh',
        transition: 'margin-left 0.3s cubic-bezier(0.22,1,0.36,1)',
      }}>

        {/* Topbar */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 40,
          background: 'linear-gradient(180deg, #0a1f0f 0%, #1a4a22 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
          padding: '0 2rem',
          height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setSidebarOpen(s => !s)}
              style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f7faf6' }}
            >
              <Icon path={icons.menu} size={16} />
            </button>
            <div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: '#f7faf6', fontWeight: 400 }}>
                {activeTab === 'dashboard' ? `Good morning, ${(user?.name || 'Farmer').split(' ')[0]}` : navItems.find(n => n.id === activeTab)?.label}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.72)', marginTop: 1 }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f7faf6', position: 'relative' }}>
              <Icon path={icons.bell} size={16} />
              <span style={{ position: 'absolute', top: 8, right: 8, width: 6, height: 6, borderRadius: '50%', background: '#a7f3d0', border: '1.5px solid rgba(255,255,255,0.45)' }} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <div style={{ flex: 1, padding: '2rem', overflowAuto: 'auto' }}>

          {/* ── DASHBOARD TAB ── */}
          {activeTab === 'dashboard' && (
            <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
                {[
                  { label: 'Total Crops',     value: crops.length,                    sub: 'all time',          icon: icons.seedling, accent: '#1a4a22' },
                  { label: 'Active Crops',    value: activeCrops,                     sub: 'in the ground',     icon: icons.leaf,     accent: '#1d4ed8' },
                  { label: 'Harvested',       value: harvestedCrops,                  sub: 'this season',       icon: icons.check,    accent: '#7c3aed' },
                  { label: 'Stock Available', value: `${totalStock}`,                 sub: 'kilograms',         icon: icons.box,      accent: '#b45309' },
                  { label: 'Total Revenue',   value: `${(totalRevenue/1000).toFixed(1)}k`, sub: 'RWF earned',   icon: icons.sales,    accent: '#065f46' },
                ].map((s, i) => (
                  <div key={i} className="stat-card" style={{ ...cardSx, padding: '1.25rem 1.25rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5a7060' }}>{s.label}</div>
                      <div style={{ width: 30, height: 30, borderRadius: 7, background: `${s.accent}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.accent }}>
                        <Icon path={s.icon} size={14} />
                      </div>
                    </div>
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.9rem', color: '#0d2410', lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: '#5a7060', marginTop: 4 }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Two-column row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                {/* Crop Overview */}
                <div style={cardSx}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div>
                      <div style={sectionLabel}><span style={{ width: 16, height: 1, background: '#2d7a3a', display: 'block' }} /> Crop Overview</div>
                      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', color: '#0d2410' }}>Active fields</div>
                    </div>
                    <button onClick={() => setActiveTab('crops')} style={btnGhost}>View all</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                    {crops.slice(0, 5).map(crop => {
                      const health = getCurrentHealth(crop.id);
                      return (
                        <div
                          key={crop.id}
                          onClick={() => { setSelectedCrop(crop); openModal('detail'); }}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0.85rem', borderRadius: 8, cursor: 'pointer', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f7fbf4'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#0d2410' }}>{crop.name}</div>
                            <div style={{ fontSize: 11, color: '#5a7060', marginTop: 1 }}>{crop.plot}</div>
                          </div>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <StatusBadge status={crop.status} meta={statusMeta} />
                            {health && <StatusBadge status={health.status} meta={healthMeta} />}
                          </div>
                        </div>
                      );
                    })}
                    {crops.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: '#5a7060', fontSize: 13 }}>No crops yet.</div>}
                  </div>
                </div>

                {/* Recent Activities */}
                <div style={cardSx}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div>
                      <div style={sectionLabel}><span style={{ width: 16, height: 1, background: '#2d7a3a', display: 'block' }} /> Farm Log</div>
                      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', color: '#0d2410' }}>Recent activities</div>
                    </div>
                    <button onClick={() => openModal('activity')} style={btnPrimary}>
                      <Icon path={icons.plus} size={14} /> Log
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[...activities].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map((act, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 8, background: '#f0faf3', border: '1px solid #d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#1a4a22' }}>
                          <Icon path={icons.tasks} size={14} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0d2410' }}>{act.type} — {act.cropName}</div>
                          <div style={{ fontSize: 11.5, color: '#5a7060', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{act.notes || 'No notes'}</div>
                        </div>
                        <div style={{ fontSize: 11, color: '#5a7060', flexShrink: 0, marginTop: 1 }}>{act.date}</div>
                      </div>
                    ))}
                    {activities.length === 0 && <div style={{ textAlign: 'center', color: '#5a7060', fontSize: 13, padding: '1.5rem 0' }}>No activities yet.</div>}
                  </div>
                </div>
              </div>

              {/* Health summary */}
              <div style={cardSx}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={sectionLabel}><span style={{ width: 16, height: 1, background: '#2d7a3a', display: 'block' }} /> Health Monitor</div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', color: '#0d2410' }}>Crop health at a glance</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  {[
                    ['Healthy',       healthMeta['Healthy'],       'All systems go'],
                    ['Pest-infected', healthMeta['Pest-infected'], 'Needs attention'],
                    ['Diseased',      healthMeta['Diseased'],      'Requires treatment'],
                  ].map(([status, m, desc]) => {
                    const count = crops.filter(c => getCurrentHealth(c.id)?.status === status).length;
                    return (
                      <div key={status} style={{ background: m.bg, borderRadius: 10, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2.5rem', color: m.color, lineHeight: 1 }}>{count}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: m.color }}>{status}</div>
                          <div style={{ fontSize: 11, color: m.color, opacity: 0.7, marginTop: 2 }}>{desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── CROPS TAB ── */}
          {activeTab === 'crops' && (
            <div className="fade-up">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                  <div style={sectionLabel}><span style={{ width: 16, height: 1, background: '#2d7a3a', display: 'block' }} /> Fields & Crops</div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.4rem', color: '#0d2410' }}>{crops.length} crop{crops.length !== 1 ? 's' : ''} registered</div>
                </div>
                <button style={btnPrimary} onClick={() => openModal('crop')}>
                  <Icon path={icons.plus} size={15} /> Plant New Crop
                </button>
              </div>

              {crops.length === 0 ? (
                <div style={{ ...cardSx, padding: '4rem', textAlign: 'center', color: '#5a7060' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🌱</div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.2rem', color: '#0d2410', marginBottom: 8 }}>No crops yet</div>
                  <div style={{ fontSize: 13 }}>Plant your first crop to get started.</div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  {crops.map(crop => {
                    const health = getCurrentHealth(crop.id);
                    const cropActivities = activities.filter(a => a.cropId === crop.id).length;
                    return (
                      <div
                        key={crop.id}
                        className="crop-card"
                        onClick={() => { setSelectedCrop(crop); openModal('detail'); }}
                        style={{ ...cardSx, padding: '1.25rem' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f0faf3', border: '1px solid #d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a4a22' }}>
                            <Icon path={icons.seedling} size={18} />
                          </div>
                          <StatusBadge status={crop.status} meta={statusMeta} />
                        </div>
                        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', color: '#0d2410', marginBottom: 2 }}>{crop.name}</div>
                        <div style={{ fontSize: 12, color: '#5a7060', marginBottom: '1rem' }}>{crop.plot} · {crop.plantingDate}</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.85rem', borderTop: '1px solid #f0ebe0' }}>
                          {health
                            ? <StatusBadge status={health.status} meta={healthMeta} />
                            : <span style={{ fontSize: 11, color: '#5a7060' }}>No health data</span>}
                          <span style={{ fontSize: 11, color: '#5a7060' }}>{cropActivities} activities</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── ACTIVITIES TAB ── */}
          {activeTab === 'activities' && (
            <div className="fade-up">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                  <div style={sectionLabel}><span style={{ width: 16, height: 1, background: '#2d7a3a', display: 'block' }} /> Activity Log</div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.4rem', color: '#0d2410' }}>{activities.length} activities logged</div>
                </div>
                <button style={btnPrimary} onClick={() => openModal('activity')}>
                  <Icon path={icons.plus} size={15} /> Log Activity
                </button>
              </div>

              <div style={{ ...cardSx, padding: 0, overflow: 'hidden' }}>
                {activities.length === 0 ? (
                  <div style={{ padding: '4rem', textAlign: 'center', color: '#5a7060' }}>
                    <div style={{ fontSize: 13 }}>No activities logged yet.</div>
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {['Crop', 'Activity', 'Date', 'Notes', ''].map(h => (
                          <th key={h} style={tableTh}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...activities].sort((a, b) => new Date(b.date) - new Date(a.date)).map(act => (
                        <tr key={act.id} style={{ transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f7fbf4'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ ...tableTd, fontWeight: 600 }}>{act.cropName}</td>
                          <td style={tableTd}>
                            <span style={{ display: 'inline-block', background: '#f0faf3', color: '#1a4a22', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6, letterSpacing: '0.04em' }}>{act.type}</span>
                          </td>
                          <td style={{ ...tableTd, color: '#5a7060' }}>{act.date}</td>
                          <td style={{ ...tableTd, color: '#5a7060', maxWidth: 240 }}>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{act.notes || '—'}</span>
                          </td>
                          <td style={tableTd}>
                            <button
                              onClick={() => setActivities(a => a.filter(ac => ac.id !== act.id))}
                              style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid #e8e0d0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a7060', transition: 'all 0.15s' }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.borderColor = '#fca5a5'; e.currentTarget.style.color = '#991b1b'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e8e0d0'; e.currentTarget.style.color = '#5a7060'; }}
                            >
                              <Icon path={icons.trash} size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ── INVENTORY TAB ── */}
          {activeTab === 'inventory' && (
            <div className="fade-up">
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={sectionLabel}><span style={{ width: 16, height: 1, background: '#2d7a3a', display: 'block' }} /> Harvest Inventory</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.4rem', color: '#0d2410' }}>{inventory.length} crop type{inventory.length !== 1 ? 's' : ''} in stock</div>
              </div>

              <div style={{ ...cardSx, padding: 0, overflow: 'hidden' }}>
                {inventory.length === 0 ? (
                  <div style={{ padding: '4rem', textAlign: 'center', color: '#5a7060', fontSize: 13 }}>
                    No inventory yet. Harvest crops to add stock.
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {['Crop Type', 'Total Harvested', 'Sold', 'Available', 'Stock Level'].map(h => (
                          <th key={h} style={tableTh}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.map(inv => {
                        const remaining = inv.totalQty - inv.soldQty;
                        const pct = inv.totalQty > 0 ? Math.round((remaining / inv.totalQty) * 100) : 0;
                        const barColor = pct > 50 ? '#2d7a3a' : pct > 20 ? '#d97706' : '#dc2626';
                        return (
                          <tr key={inv.id}
                            onMouseEnter={e => e.currentTarget.style.background = '#f7fbf4'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <td style={{ ...tableTd, fontFamily: "'DM Serif Display', serif", fontSize: 15 }}>{inv.cropType}</td>
                            <td style={{ ...tableTd, color: '#5a7060' }}>{inv.totalQty} kg</td>
                            <td style={{ ...tableTd, color: '#5a7060' }}>{inv.soldQty} kg</td>
                            <td style={{ ...tableTd, fontWeight: 700, fontSize: 15 }}>{remaining} kg</td>
                            <td style={{ ...tableTd, width: 160 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ flex: 1, height: 5, background: '#e8e0d0', borderRadius: 10, overflow: 'hidden' }}>
                                  <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 10, transition: 'width 0.6s ease' }} />
                                </div>
                                <span style={{ fontSize: 11, fontWeight: 600, color: barColor, width: 28, textAlign: 'right' }}>{pct}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ── SALES TAB ── */}
          {activeTab === 'sales' && (
            <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Summary cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {[
                  { label: 'Total Revenue', value: `${totalRevenue.toLocaleString()} RWF`, icon: '💰' },
                  { label: 'Transactions', value: sales.length, icon: '📋' },
                  { label: 'Total Sold', value: `${sales.reduce((s, x) => s + x.qty, 0)} kg`, icon: '⚖️' },
                ].map((s, i) => (
                  <div key={i} style={cardSx}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.6rem', color: '#0d2410' }}>{s.value}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5a7060', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={sectionLabel}><span style={{ width: 16, height: 1, background: '#2d7a3a', display: 'block' }} /> Transaction History</div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.2rem', color: '#0d2410' }}>{sales.length} sales recorded</div>
                </div>
                <button style={btnPrimary} onClick={() => openModal('sale')}>
                  <Icon path={icons.plus} size={15} /> Record Sale
                </button>
              </div>

              <div style={{ ...cardSx, padding: 0, overflow: 'hidden' }}>
                {sales.length === 0 ? (
                  <div style={{ padding: '4rem', textAlign: 'center', color: '#5a7060', fontSize: 13 }}>No sales recorded yet.</div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {['Date', 'Crop', 'Quantity', 'Price / kg', 'Total'].map(h => (
                          <th key={h} style={tableTh}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...sales].sort((a, b) => new Date(b.date) - new Date(a.date)).map(sale => (
                        <tr key={sale.id}
                          onMouseEnter={e => e.currentTarget.style.background = '#f7fbf4'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ ...tableTd, color: '#5a7060' }}>{sale.date}</td>
                          <td style={{ ...tableTd, fontFamily: "'DM Serif Display', serif", fontSize: 15 }}>{sale.cropType}</td>
                          <td style={{ ...tableTd, color: '#5a7060' }}>{sale.qty} kg</td>
                          <td style={{ ...tableTd, color: '#5a7060' }}>{sale.price.toLocaleString()} RWF</td>
                          <td style={{ ...tableTd, fontWeight: 700, color: '#1a4a22', fontSize: 15 }}>{sale.total.toLocaleString()} RWF</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ══ MODALS ══════════════════════════════════════════════════════════════ */}

      {/* New Crop */}
      <Modal isOpen={modals.crop} onClose={() => closeModal('crop')} title="Plant New Crop">
        <div style={{ borderBottom: '1px solid #f0ebe0', marginBottom: '1.25rem', paddingBottom: '1rem' }}>
          <p style={{ fontSize: 13, color: '#5a7060', lineHeight: 1.6 }}>Register a new crop to start tracking its lifecycle from planting to harvest.</p>
        </div>
        <Field label="Crop Type">
          <select style={inputSx} value={cropForm.type} onChange={e => setCropForm({ ...cropForm, type: e.target.value })}>
            {['Maize', 'Beans', 'Sorghum', 'Wheat', 'Rice', 'Cassava', 'Sweet Potato'].map(t => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Plot / Field Name">
          <input style={inputSx} placeholder="e.g. North Field A" value={cropForm.plot} onChange={e => setCropForm({ ...cropForm, plot: e.target.value })} />
        </Field>
        <Field label="Planting Date">
          <input style={inputSx} type="date" value={cropForm.date} onChange={e => setCropForm({ ...cropForm, date: e.target.value })} />
        </Field>
        <button className="btn-submit" onClick={handleCreateCrop}>🌱 Plant Crop</button>
      </Modal>

      {/* Log Activity */}
      <Modal isOpen={modals.activity} onClose={() => closeModal('activity')} title="Log Farm Activity">
        <div style={{ borderBottom: '1px solid #f0ebe0', marginBottom: '1.25rem', paddingBottom: '1rem' }}>
          <p style={{ fontSize: 13, color: '#5a7060', lineHeight: 1.6 }}>Record an activity such as irrigation, fertilization, or pest control for a crop.</p>
        </div>
        <Field label="Select Crop">
          <select style={inputSx} value={activityForm.cropId} onChange={e => setActivityForm({ ...activityForm, cropId: e.target.value })}>
            <option value="">Choose a crop…</option>
            {crops.filter(c => c.status !== 'Harvested').map(c => <option key={c.id} value={c.id}>{c.name} — {c.plot}</option>)}
          </select>
        </Field>
        <Field label="Activity Type">
          <select style={inputSx} value={activityForm.type} onChange={e => setActivityForm({ ...activityForm, type: e.target.value })}>
            {['Irrigation', 'Fertilization', 'Pest Control', 'Disease Control', 'Weeding', 'Pruning', 'Inspection'].map(t => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Date">
          <input style={inputSx} type="date" value={activityForm.date} onChange={e => setActivityForm({ ...activityForm, date: e.target.value })} />
        </Field>
        <Field label="Notes">
          <textarea style={{ ...inputSx, resize: 'vertical', minHeight: 80 }} placeholder="Any observations or details…" value={activityForm.notes} onChange={e => setActivityForm({ ...activityForm, notes: e.target.value })} />
        </Field>
        <button className="btn-submit" onClick={handleAddActivity}>✓ Log Activity</button>
      </Modal>

      {/* Health Update */}
      <Modal isOpen={modals.health} onClose={() => closeModal('health')} title={`Update Health — ${selectedCrop?.name || ''}`}>
        <div style={{ borderBottom: '1px solid #f0ebe0', marginBottom: '1.25rem', paddingBottom: '1rem' }}>
          <p style={{ fontSize: 13, color: '#5a7060', lineHeight: 1.6 }}>Record the current health status of this crop based on your field observations.</p>
        </div>
        <Field label="Health Status">
          <select style={inputSx} value={healthForm.status} onChange={e => setHealthForm({ ...healthForm, status: e.target.value })}>
            {['Healthy', 'Pest-infected', 'Diseased'].map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Observations & Notes">
          <textarea style={{ ...inputSx, resize: 'vertical', minHeight: 100 }} placeholder="Describe what you observed in the field…" value={healthForm.notes} onChange={e => setHealthForm({ ...healthForm, notes: e.target.value })} />
        </Field>
        <button className="btn-submit" onClick={handleUpdateHealth}>✓ Save Health Record</button>
      </Modal>

      {/* Harvest */}
      <Modal isOpen={modals.harvest} onClose={() => closeModal('harvest')} title={`Harvest — ${selectedCrop?.name || ''}`}>
        <div style={{ borderBottom: '1px solid #f0ebe0', marginBottom: '1.25rem', paddingBottom: '1rem' }}>
          <p style={{ fontSize: 13, color: '#5a7060', lineHeight: 1.6 }}>Recording a harvest will mark the crop as <strong style={{ color: '#7c3aed' }}>Harvested</strong> and add the yield to your inventory.</p>
        </div>
        <Field label="Quantity Harvested (kg)">
          <input style={inputSx} type="number" step="0.1" min="0.1" placeholder="e.g. 250" value={harvestForm.qty} onChange={e => setHarvestForm({ ...harvestForm, qty: e.target.value })} />
        </Field>
        <Field label="Harvest Date">
          <input style={inputSx} type="date" value={harvestForm.date} onChange={e => setHarvestForm({ ...harvestForm, date: e.target.value })} />
        </Field>
        {harvestForm.qty && (
          <div style={{ background: '#f0faf3', border: '1px solid #d1fae5', borderRadius: 8, padding: '0.85rem 1rem', marginBottom: '0.5rem', fontSize: 13, color: '#1a4a22' }}>
            📦 <strong>{harvestForm.qty} kg</strong> of {selectedCrop?.name} will be added to inventory.
          </div>
        )}
        <button className="btn-submit" onClick={handleHarvest}>🌾 Confirm Harvest</button>
      </Modal>

      {/* Record Sale */}
      <Modal isOpen={modals.sale} onClose={() => closeModal('sale')} title="Record Sale">
        <div style={{ borderBottom: '1px solid #f0ebe0', marginBottom: '1.25rem', paddingBottom: '1rem' }}>
          <p style={{ fontSize: 13, color: '#5a7060', lineHeight: 1.6 }}>Log a sale transaction. Stock will be deducted automatically from your inventory.</p>
        </div>
        <Field label="Crop">
          <select style={inputSx} value={saleForm.cropType} onChange={e => setSaleForm({ ...saleForm, cropType: e.target.value })}>
            <option value="">Choose a crop…</option>
            {inventory.map(i => {
              const avail = i.totalQty - i.soldQty;
              return <option key={i.id} value={i.cropType}>{i.cropType} — {avail} kg available</option>;
            })}
          </select>
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Quantity (kg)">
            <input style={inputSx} type="number" step="0.1" min="0.1" placeholder="0" value={saleForm.qty} onChange={e => setSaleForm({ ...saleForm, qty: e.target.value })} />
          </Field>
          <Field label="Price per kg (RWF)">
            <input style={inputSx} type="number" step="1" min="0" placeholder="800" value={saleForm.price} onChange={e => setSaleForm({ ...saleForm, price: e.target.value })} />
          </Field>
        </div>
        {saleForm.qty && saleForm.price && !isNaN(parseFloat(saleForm.qty)) && !isNaN(parseFloat(saleForm.price)) && (
          <div style={{ background: '#f0faf3', border: '1px solid #d1fae5', borderRadius: 8, padding: '0.85rem 1rem', marginBottom: '0.5rem' }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5a7060', marginBottom: 4 }}>Sale Total</div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.6rem', color: '#1a4a22' }}>
              {(parseFloat(saleForm.qty) * parseFloat(saleForm.price)).toLocaleString()} RWF
            </div>
          </div>
        )}
        <button className="btn-submit" onClick={handleSale}>✓ Record Sale</button>
      </Modal>

      {/* Crop Detail */}
      <Modal isOpen={modals.detail} onClose={() => closeModal('detail')} title={selectedCrop ? `${selectedCrop.name}` : ''}>
        {selectedCrop && (() => {
          const crop = crops.find(c => c.id === selectedCrop.id);
          if (!crop) return null;
          const health = getCurrentHealth(crop.id);
          const cropLogs = [...healthLogs].filter(h => h.cropId === crop.id).sort((a, b) => new Date(b.date) - new Date(a.date));
          const cropActs = [...activities].filter(a => a.cropId === crop.id).sort((a, b) => new Date(b.date) - new Date(a.date));
          return (
            <div>
              {/* Meta grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '1.25rem' }}>
                <div style={{ background: '#f4efe6', borderRadius: 8, padding: '0.85rem 1rem' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#5a7060', marginBottom: 6 }}>Plot</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0d2410' }}>{crop.plot}</div>
                </div>
                <div style={{ background: '#f4efe6', borderRadius: 8, padding: '0.85rem 1rem' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#5a7060', marginBottom: 6 }}>Planted</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0d2410' }}>{crop.plantingDate}</div>
                </div>
                <div style={{ background: '#f4efe6', borderRadius: 8, padding: '0.85rem 1rem' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#5a7060', marginBottom: 6 }}>Status</div>
                  <StatusBadge status={crop.status} meta={statusMeta} />
                </div>
                <div style={{ background: '#f4efe6', borderRadius: 8, padding: '0.85rem 1rem' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#5a7060', marginBottom: 6 }}>Health</div>
                  {health ? <StatusBadge status={health.status} meta={healthMeta} /> : <span style={{ fontSize: 12, color: '#5a7060' }}>Not recorded</span>}
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <button
                  className="action-btn"
                  style={{ background: '#f0faf3', color: '#1a4a22', border: '1px solid #d1fae5' }}
                  onClick={() => { closeModal('detail'); openModal('health'); }}
                >
                  <Icon path={icons.heart} size={12} /> Update Health
                </button>
                {crop.status !== 'Harvested' && (
                  <button
                    className="action-btn"
                    style={{ background: '#f3e8ff', color: '#6b21a8', border: '1px solid #e9d5ff' }}
                    onClick={() => { closeModal('detail'); openModal('harvest'); }}
                  >
                    <Icon path={icons.scissors} size={12} /> Harvest Crop
                  </button>
                )}
                <button
                  className="action-btn"
                  style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', marginLeft: 'auto' }}
                  onClick={() => handleDeleteCrop(crop.id)}
                >
                  <Icon path={icons.trash} size={12} /> Delete
                </button>
              </div>

              {/* Health history */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#5a7060', marginBottom: '0.6rem' }}>Health History</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 130, overflowY: 'auto' }}>
                  {cropLogs.length === 0
                    ? <div style={{ fontSize: 12, color: '#5a7060' }}>No health records.</div>
                    : cropLogs.map((log, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, padding: '4px 0' }}>
                        <span style={{ color: '#5a7060', flexShrink: 0, width: 80 }}>{log.date}</span>
                        <StatusBadge status={log.status} meta={healthMeta} />
                        <span style={{ color: '#5a7060', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.notes}</span>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Activity history */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#5a7060', marginBottom: '0.6rem' }}>Activity History</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 150, overflowY: 'auto' }}>
                  {cropActs.length === 0
                    ? <div style={{ fontSize: 12, color: '#5a7060' }}>No activities recorded.</div>
                    : cropActs.map((act, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12, padding: '4px 0' }}>
                        <span style={{ color: '#5a7060', flexShrink: 0, width: 80 }}>{act.date}</span>
                        <span style={{ background: '#f0faf3', color: '#1a4a22', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 5, flexShrink: 0 }}>{act.type}</span>
                        <span style={{ color: '#5a7060', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{act.notes}</span>
                      </div>
                    ))
                  }
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