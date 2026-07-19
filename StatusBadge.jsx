const styles = {
  New: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
  Contacted: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  Converted: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
};

/**
 * Small pill badge that reflects a lead's current status with color coding.
 */
const StatusBadge = ({ status }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
