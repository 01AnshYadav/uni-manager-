"use client";

import { useEffect, useState, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { Download, File as FileIcon } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { Resource } from "@/lib/api/types";
import StateRenderer from "@/components/ui/StateRenderer";

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadResources() {
      try {
        setIsLoading(true);
        const data = await apiClient.getResources();
        setResources(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    }
    loadResources();
  }, []);

  // Group resources by subject
  const groupedResources = useMemo(() => {
    return resources.reduce((acc, resource) => {
      if (!acc[resource.subject]) {
        acc[resource.subject] = [];
      }
      acc[resource.subject].push(resource);
      return acc;
    }, {} as Record<string, Resource[]>);
  }, [resources]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Resources</h1>
        <p className="text-slate-500 mt-1">Study materials, past papers, and class notes.</p>
      </div>

      <StateRenderer 
        isLoading={isLoading} 
        error={error} 
        isEmpty={!isLoading && resources.length === 0}
        emptyTitle="No Resources Found"
        emptyMessage="There are currently no files uploaded."
      >
        <div className="space-y-8">
          {Object.entries(groupedResources).map(([subject, items]) => (
            <div key={subject} className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                {subject}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((resource) => (
                  <a
                    key={resource.id}
                    href={resource.file_url}
                    className="group flex items-center p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <FileIcon className="w-6 h-6" />
                    </div>
                    <div className="ml-4 flex-1 truncate">
                      <h3 className="font-medium text-slate-900 truncate" title={resource.title}>
                        {resource.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Added {formatDistanceToNow(new Date(resource.created_at))} ago
                      </p>
                    </div>
                    <Download className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors ml-2 flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </StateRenderer>
    </div>
  );
}
