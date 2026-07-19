import { AlertTriangle, RefreshCw } from "lucide-react";

/**
 * Shown when a request fails, with an optional retry action.
 */
const ErrorState = ({ message = "Something went wrong.", onRetry }) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-4">
    <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
      <AlertTriangle size={26} className="text-red-500" />
    </div>
    <h3 className="text-slate-800 font-semibold">Unable to load data</h3>
    <p className="text-slate-500 text-sm mt-1 max-w-sm">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-secondary mt-4">
        <RefreshCw size={16} />
        Try again
      </button>
    )}
  </div>
);

export default ErrorState;
