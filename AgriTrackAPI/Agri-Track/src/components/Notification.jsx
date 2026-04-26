// ─── NOTIFICATION ───────────────────────────────────────────────────────────────
import { Icon, icons } from './Icon';

function Notification({ notifications, removeNotification }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map(n => (
        <div key={n.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium min-w-[280px] border backdrop-blur-sm
          ${n.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : n.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}
          style={{ animation: 'slideInRight 0.3s ease' }}>
          <Icon path={n.type === 'success' ? icons.check : n.type === 'error' ? icons.x : icons.info} size={16} />
          <span>{n.message}</span>
          <button onClick={() => removeNotification(n.id)} className="ml-auto opacity-60 hover:opacity-100">
            <Icon path={icons.x} size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default Notification;