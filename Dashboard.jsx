import { useEffect, useState } from "react";
import { Users, UserPlus, PhoneCall, CheckCircle2 } from "lucide-react";
import api from "../api/axios";
import DashboardLayout from "../components/DashboardLayout.jsx";
import DashboardCard from "../components/DashboardCard.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import Spinner from "../components/Spinner.jsx";
import ErrorState from "../components/ErrorState.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/leads/stats/dashboard");
      setStats(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const maxSourceCount = stats?.bySource?.length
    ? Math.max(...stats.bySource.map((s) => s.count))
    : 1;

  return (
    <DashboardLayout title="Dashboard">
      {loading && <Spinner label="Loading dashboard..." />}
      {!loading && error && <ErrorState message={error} onRetry={fetchStats} />}

      {!loading && !error && stats && (
        <div className="space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard label="Total Leads" value={stats.total} icon={Users} accent="brand" />
            <DashboardCard label="New Leads" value={stats.new} icon={UserPlus} accent="slate" />
            <DashboardCard label="Contacted Leads" value={stats.contacted} icon={PhoneCall} accent="amber" />
            <DashboardCard label="Converted Leads" value={stats.converted} icon={CheckCircle2} accent="green" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent leads */}
            <div className="lg:col-span-2 card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-800">Recent Leads</h2>
                <Link to="/leads" className="text-sm text-brand-600 font-medium hover:underline">
                  View all
                </Link>
              </div>

              {stats.recentLeads.length === 0 ? (
                <EmptyState
                  title="No leads yet"
                  description="Create your first lead to see it appear here."
                />
              ) : (
                <div className="space-y-3">
                  {stats.recentLeads.map((lead) => (
                    <Link
                      key={lead._id}
                      to={`/leads/${lead._id}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{lead.name}</p>
                        <p className="text-xs text-slate-500">{lead.email}</p>
                      </div>
                      <StatusBadge status={lead.status} />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Leads by source */}
            <div className="card p-5">
              <h2 className="font-semibold text-slate-800 mb-4">Leads by Source</h2>
              {stats.bySource.length === 0 ? (
                <EmptyState title="No data yet" />
              ) : (
                <div className="space-y-3">
                  {stats.bySource.map((s) => (
                    <div key={s._id || "unknown"}>
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>{s._id || "Unknown"}</span>
                        <span>{s.count}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-500 rounded-full"
                          style={{ width: `${(s.count / maxSourceCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
