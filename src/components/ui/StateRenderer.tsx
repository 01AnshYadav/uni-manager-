import { AlertCircle, FileX, Loader2, ServerCrash, ShieldAlert } from "lucide-react";

interface StateRendererProps {
  isLoading: boolean;
  error: Error | null;
  isEmpty: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  children: React.ReactNode;
}

export default function StateRenderer({
  isLoading,
  error,
  isEmpty,
  emptyTitle = "Nothing here yet",
  emptyMessage = "No items found to display.",
  children
}: StateRendererProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
        <p className="font-medium animate-pulse">Loading data...</p>
      </div>
    );
  }

  if (error) {
    const isUnauthorized = (error as any).status === 401 || (error as any).status === 403;
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-red-50 rounded-2xl border border-red-200">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
          {isUnauthorized ? <ShieldAlert className="w-8 h-8" /> : <ServerCrash className="w-8 h-8" />}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          {isUnauthorized ? "Access Denied" : "Something went wrong"}
        </h3>
        <p className="text-slate-600 max-w-md">
          {error.message || "Failed to fetch data from the server. Please try again later."}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
          <FileX className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">{emptyTitle}</h3>
        <p className="text-slate-500 max-w-sm mt-1">{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
}
