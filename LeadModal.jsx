import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

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

/**
 * Modal used for both creating a new lead and editing an existing one.
 * Pass `lead` to prefill the form for editing; omit it for create mode.
 */
const LeadModal = ({ open, onClose, onSubmit, lead, submitting }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const isEditMode = Boolean(lead);

  useEffect(() => {
    if (open) {
      reset(
        lead
          ? {
              name: lead.name,
              email: lead.email,
              phone: lead.phone,
              company: lead.company,
              source: lead.source,
              status: lead.status,
              followUpDate: lead.followUpDate
                ? lead.followUpDate.split("T")[0]
                : "",
            }
          : {
              name: "",
              email: "",
              phone: "",
              company: "",
              source: "Website",
              status: "New",
              followUpDate: "",
              note: "",
            }
      );
    }
  }, [open, lead, reset]);

  if (!open) return null;

  const submitHandler = (formData) => {
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h3 className="font-semibold text-slate-800">
            {isEditMode ? "Edit Lead" : "Add New Lead"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="p-6 space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input
              className="input"
              placeholder="e.g. Jane Cooper"
              {...register("name", { required: "Full name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="jane@company.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Enter a valid email",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input
                className="input"
                placeholder="+1 555 123 4567"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9+\-\s()]{7,20}$/,
                    message: "Enter a valid phone number",
                  },
                })}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="label">Company</label>
            <input
              className="input"
              placeholder="Company name"
              {...register("company")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Lead Source</label>
              <select className="input" {...register("source")}>
                {SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" {...register("status")}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Follow-up Date</label>
            <input type="date" className="input" {...register("followUpDate")} />
          </div>

          {!isEditMode && (
            <div>
              <label className="label">Initial Note (optional)</label>
              <textarea
                className="input"
                rows={3}
                placeholder="Any context about this lead..."
                {...register("note")}
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting
                ? "Saving..."
                : isEditMode
                ? "Save Changes"
                : "Create Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
