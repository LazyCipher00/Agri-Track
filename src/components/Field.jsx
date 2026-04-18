// ─── FORM FIELD ─────────────────────────────────────────────────────────────────
const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm transition-all bg-gray-50 focus:bg-white";
const selectClass = inputClass;

function Field({ label, children }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export { Field, inputClass, selectClass };