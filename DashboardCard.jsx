/**
 * A single stat card used on the dashboard (Total Leads, New Leads, etc).
 */
const DashboardCard = ({ label, value, icon: Icon, accent = "brand" }) => {
  const accentClasses = {
    brand: "bg-brand-50 text-brand-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="card p-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accentClasses[accent]}`}>
        <Icon size={22} />
      </div>
    </div>
  );
};

export default DashboardCard;
