import { Loader2 } from "lucide-react";

const Spinner = ({ size = 24, label }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-12 text-slate-400">
    <Loader2 size={size} className="animate-spin text-brand-500" />
    {label && <span className="text-sm">{label}</span>}
  </div>
);

export default Spinner;
