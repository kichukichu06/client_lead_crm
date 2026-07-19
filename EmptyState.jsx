import { Inbox } from "lucide-react";

/**
 * Shown when a list has no data to display (e.g. no leads match the filters).
 */
const EmptyState = ({ title = "Nothing here yet", description, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-4">
    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
      <Inbox size={26} className="text-slate-400" />
    </div>
    <h3 className="text-slate-800 font-semibold">{title}</h3>
    {description && (
      <p className="text-slate-500 text-sm mt-1 max-w-sm">{description}</p>
    )}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
