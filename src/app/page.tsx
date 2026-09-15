import { mockAnnouncements } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, Calendar, FileText, Info } from "lucide-react";
import { cn } from "@/lib/utils";

function getCategoryIcon(category: string) {
  switch (category) {
    case "exam": return <AlertCircle className="w-5 h-5 text-red-500" />;
    case "event": return <Calendar className="w-5 h-5 text-blue-500" />;
    case "assignment": return <FileText className="w-5 h-5 text-amber-500" />;
    default: return <Info className="w-5 h-5 text-slate-500" />;
  }
}

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Announcements</h1>
          <p className="text-slate-500 mt-1">Latest updates and important notices.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {mockAnnouncements.map((announcement) => (
          <div
            key={announcement.id}
            className={cn(
              "p-5 rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md",
              announcement.priority === "urgent" ? "border-red-200 bg-red-50/50" : "border-slate-200"
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-xl",
                  announcement.priority === "urgent" ? "bg-red-100" : "bg-slate-100"
                )}>
                  {getCategoryIcon(announcement.category)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 leading-tight">
                    {announcement.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                    <span className="capitalize font-medium text-slate-600">{announcement.category}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(announcement.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
              {announcement.priority === "urgent" && (
                <span className="px-2.5 py-1 text-xs font-semibold tracking-wide text-red-600 uppercase bg-red-100 rounded-full">
                  Urgent
                </span>
              )}
            </div>
            <p className="text-slate-600 leading-relaxed pl-14">
              {announcement.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
