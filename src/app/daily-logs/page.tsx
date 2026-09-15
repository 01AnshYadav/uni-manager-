"use client";

import { useEffect, useState } from "react";
import { BookOpen, Calendar as CalendarIcon, Image as ImageIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { apiClient } from "@/lib/api/client";
import { DailyLog } from "@/lib/api/types";
import StateRenderer from "@/components/ui/StateRenderer";

export default function DailyLogsPage() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadLogs() {
      try {
        setIsLoading(true);
        const data = await apiClient.getDailyLogs({ date: selectedDate });
        setLogs(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    }
    loadLogs();
  }, [selectedDate]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Class Log</h1>
          <p className="text-slate-500 mt-1">What happened in class today.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <CalendarIcon className="w-5 h-5 text-slate-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-slate-700 font-medium cursor-pointer"
          />
        </div>
      </div>

      <StateRenderer 
        isLoading={isLoading} 
        error={error} 
        isEmpty={!isLoading && logs.length === 0}
        emptyTitle="No logs for this date"
        emptyMessage={`There are no class logs recorded for ${selectedDate ? format(parseISO(selectedDate), "MMMM d, yyyy") : 'this date'}.`}
      >
        <div className="grid gap-6">
          {logs.map((log) => (
            <div key={log.id} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                <h2 className="text-xl font-semibold text-slate-900">{log.subject}</h2>
              </div>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {log.summary}
              </p>
              
              {log.photo_urls && log.photo_urls.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Attached Whiteboard Photos
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {log.photo_urls.map((url, idx) => (
                      <div key={idx} className="aspect-video relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={url} 
                          alt={`Whiteboard photo for ${log.subject}`} 
                          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </StateRenderer>
    </div>
  );
}
