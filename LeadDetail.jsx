import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Building2, Calendar, Send, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import DashboardLayout from "../components/DashboardLayout.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import Spinner from "../components/Spinner.jsx";
import ErrorState from "../components/ErrorState.jsx";
import LeadModal from "../components/LeadModal.jsx";

const STATUSES = ["New", "Contacted", "Converted"];

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [noteText, setNoteText] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchLead = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/leads/${id}`);
      setLead(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load lead");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const { data } = await api.put(`/leads/${id}/status`, { status: newStatus });
      setLead(data.data);
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setAddingNote(true);
    try {
      const { data } = await api.post(`/leads/${id}/notes`, { text: noteText.trim() });
      setLead(data.data);
      setNoteText("");
      toast.success("Note added");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add note");
    } finally {
      setAddingNote(false);
    }
  };

  const handleEditSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const { data } = await api.put(`/leads/${id}`, formData);
      setLead(data.data);
      setEditModalOpen(false);
      toast.success("Lead updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update lead");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Lead Details">
      <button
        onClick={() => navigate("/leads")}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600 mb-4"
      >
        <ArrowLeft size={16} />
        Back to Leads
      </button>

      {loading && <Spinner label="Loading lead..." />}
      {!loading && error && <ErrorState message={error} onRetry={fetchLead} />}

      {!loading && !error && lead && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: lead info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">{lead.name}</h2>
                  <p className="text-sm text-slate-500">{lead.company || "No company"}</p>
                </div>
                <button
                  className="btn-secondary !px-3 !py-2"
                  onClick={() => setEditModalOpen(true)}
                >
                  <Pencil size={14} />
                </button>
              </div>

              <div className="mt-4">
                <label className="label">Status</label>
                <select
                  className="input"
                  value={lead.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail size={16} className="text-slate-400" />
                  {lead.email}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone size={16} className="text-slate-400" />
                  {lead.phone}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Building2 size={16} className="text-slate-400" />
                  {lead.company || "—"}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar size={16} className="text-slate-400" />
                  Follow-up:{" "}
                  {lead.followUpDate
                    ? new Date(lead.followUpDate).toLocaleDateString()
                    : "Not scheduled"}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-1">
                <p>Source: {lead.source}</p>
                <p>Created: {new Date(lead.createdAt).toLocaleString()}</p>
                <p>Last updated: {new Date(lead.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Right: notes timeline */}
          <div className="lg:col-span-2">
            <div className="card p-5">
              <h3 className="font-semibold text-slate-800 mb-4">Notes & Timeline</h3>

              <form onSubmit={handleAddNote} className="flex gap-2 mb-5">
                <input
                  className="input"
                  placeholder="Add a note or update..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn-primary !px-4"
                  disabled={addingNote || !noteText.trim()}
                >
                  <Send size={16} />
                </button>
              </form>

              {lead.notes.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">
                  No notes yet. Add the first update above.
                </p>
              ) : (
                <div className="space-y-4">
                  {[...lead.notes]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((note) => (
                      <div key={note._id} className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-brand-500 mt-2 shrink-0" />
                        <div>
                          <p className="text-sm text-slate-700">{note.text}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {new Date(note.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <LeadModal
        open={editModalOpen}
        lead={lead}
        submitting={submitting}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleEditSubmit}
      />
    </DashboardLayout>
  );
};

export default LeadDetail;
