import { useEffect, useState, useCallback } from "react";
import { Search, Plus, Download, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import DashboardLayout from "../components/DashboardLayout.jsx";
import LeadTable from "../components/LeadTable.jsx";
import LeadModal from "../components/LeadModal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import Spinner from "../components/Spinner.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorState from "../components/ErrorState.jsx";

const SOURCES = [
  "Website",
  "Referral",
  "Social Media",
  "Cold Call",
  "Email Campaign",
  "Advertisement",
  "Other",
];
const STATUSES = ["New", "Contacted", "Converted"];

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [source, setSource] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/leads", {
        params: { search, source, status, sort, page, limit: 10 },
      });
      setLeads(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [search, source, status, sort, page]);

  useEffect(() => {
    const timeout = setTimeout(fetchLeads, 300); // debounce search
    return () => clearTimeout(timeout);
  }, [fetchLeads]);

  const openCreateModal = () => {
    setEditingLead(null);
    setModalOpen(true);
  };

  const openEditModal = (lead) => {
    setEditingLead(lead);
    setModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingLead) {
        await api.put(`/leads/${editingLead._id}`, formData);
        toast.success("Lead updated successfully");
      } else {
        await api.post("/leads", formData);
        toast.success("Lead created successfully");
      }
      setModalOpen(false);
      fetchLeads();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/leads/${deleteTarget._id}`);
      toast.success("Lead deleted");
      setDeleteTarget(null);
      fetchLeads();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete lead");
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (lead, newStatus) => {
    try {
      await api.put(`/leads/${lead._id}/status`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      fetchLeads();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get("/leads/export/csv", {
        params: { search, source, status },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "leads-export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Export started");
    } catch {
      toast.error("Failed to export leads");
    }
  };

  return (
    <DashboardLayout title="Leads">
      <div className="space-y-5">
        {/* Toolbar */}
        <div className="card p-4 flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input !pl-9"
              placeholder="Search by name, email or company..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              className="input !w-auto"
              value={source}
              onChange={(e) => {
                setPage(1);
                setSource(e.target.value);
              }}
            >
              <option value="">All Sources</option>
              {SOURCES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              className="input !w-auto"
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value);
              }}
            >
              <option value="">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              className="input !w-auto"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>

            <button className="btn-secondary" onClick={handleExport}>
              <Download size={16} />
              Export
            </button>

            <button className="btn-primary" onClick={openCreateModal}>
              <Plus size={16} />
              Add Lead
            </button>
          </div>
        </div>

        {/* Content */}
        {loading && <Spinner label="Loading leads..." />}
        {!loading && error && <ErrorState message={error} onRetry={fetchLeads} />}

        {!loading && !error && leads.length === 0 && (
          <EmptyState
            title="No leads found"
            description="Try adjusting your search or filters, or add a new lead to get started."
            action={
              <button className="btn-primary" onClick={openCreateModal}>
                <Plus size={16} />
                Add Lead
              </button>
            }
          />
        )}

        {!loading && !error && leads.length > 0 && (
          <>
            <LeadTable
              leads={leads}
              onEdit={openEditModal}
              onDelete={setDeleteTarget}
              onStatusChange={handleStatusChange}
            />

            {/* Pagination */}
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>
                Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total leads)
              </span>
              <div className="flex gap-2">
                <button
                  className="btn-secondary !px-3 !py-2"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  className="btn-secondary !px-3 !py-2"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <LeadModal
        open={modalOpen}
        lead={editingLead}
        submitting={submitting}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this lead?"
        description={`This will permanently remove ${deleteTarget?.name || "this lead"} and all associated notes.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </DashboardLayout>
  );
};

export default Leads;
