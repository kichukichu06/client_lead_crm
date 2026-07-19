import { Eye, Pencil, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";
import { useNavigate } from "react-router-dom";

const STATUSES = ["New", "Contacted", "Converted"];

/**
 * Responsive table of leads. Collapses to a stacked card layout on small screens.
 */
const LeadTable = ({ leads, onEdit, onDelete, onStatusChange }) => {
  const navigate = useNavigate();

  return (
    <div className="card overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-slate-500">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Company</th>
              <th className="px-5 py-3 font-medium">Source</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Follow-up</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead._id}
                className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
              >
                <td
                  className="px-5 py-3 font-medium text-slate-800 cursor-pointer"
                  onClick={() => navigate(`/leads/${lead._id}`)}
                >
                  {lead.name}
                </td>
                <td className="px-5 py-3 text-slate-500">{lead.email}</td>
                <td className="px-5 py-3 text-slate-500">{lead.company || "—"}</td>
                <td className="px-5 py-3 text-slate-500">{lead.source}</td>
                <td className="px-5 py-3">
                  <select
                    value={lead.status}
                    onChange={(e) => onStatusChange(lead, e.target.value)}
                    className="text-xs font-medium rounded-full border-0 bg-transparent focus:ring-2 focus:ring-brand-500 cursor-pointer"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-3 text-slate-500">
                  {lead.followUpDate
                    ? new Date(lead.followUpDate).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg"
                      onClick={() => navigate(`/leads/${lead._id}`)}
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg"
                      onClick={() => onEdit(lead)}
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      onClick={() => onDelete(lead)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="md:hidden divide-y divide-slate-50">
        {leads.map((lead) => (
          <div key={lead._id} className="p-4">
            <div className="flex items-start justify-between">
              <div onClick={() => navigate(`/leads/${lead._id}`)}>
                <p className="font-medium text-slate-800">{lead.name}</p>
                <p className="text-xs text-slate-500">{lead.email}</p>
              </div>
              <StatusBadge status={lead.status} />
            </div>
            <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
              <span>{lead.company || "—"}</span>
              <span>{lead.source}</span>
            </div>
            <div className="flex items-center justify-end gap-1 mt-3">
              <button
                className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg"
                onClick={() => navigate(`/leads/${lead._id}`)}
              >
                <Eye size={16} />
              </button>
              <button
                className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg"
                onClick={() => onEdit(lead)}
              >
                <Pencil size={16} />
              </button>
              <button
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                onClick={() => onDelete(lead)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadTable;
