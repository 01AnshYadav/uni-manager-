"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, Calendar, FileText, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api/client";
import { Post } from "@/lib/api/types";
import StateRenderer from "@/components/ui/StateRenderer";

function getCategoryIcon(category: string) {
  switch (category) {
    case "exam": return <AlertCircle className="w-5 h-5 text-red-500" />;
    case "event": return <Calendar className="w-5 h-5 text-blue-500" />;
    case "assignment": return <FileText className="w-5 h-5 text-amber-500" />;
    default: return <Info className="w-5 h-5 text-slate-500" />;
  }
}

export default function UpdatesPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        setIsLoading(true);
        const data = await apiClient.getPosts();
        setPosts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    }
    loadPosts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Updates</h1>
          <p className="text-slate-500 mt-1">Latest announcements and important notices.</p>
        </div>
      </div>

      <StateRenderer 
        isLoading={isLoading} 
        error={error} 
        isEmpty={!isLoading && posts.length === 0}
        emptyTitle="No Updates Yet"
        emptyMessage="Check back later for important announcements."
      >
        <div className="grid gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className={cn(
                "p-5 rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md",
                post.priority === "urgent" ? "border-red-200 bg-red-50/50" : "border-slate-200"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-xl",
                    post.priority === "urgent" ? "bg-red-100" : "bg-slate-100"
                  )}>
                    {getCategoryIcon(post.category)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900 leading-tight">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                      <span className="capitalize font-medium text-slate-600">{post.category}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
                {post.priority === "urgent" && (
                  <span className="px-2.5 py-1 text-xs font-semibold tracking-wide text-red-600 uppercase bg-red-100 rounded-full">
                    Urgent
                  </span>
                )}
              </div>
              <p className="text-slate-600 leading-relaxed pl-14">
                {post.body}
              </p>
            </div>
          ))}
        </div>
      </StateRenderer>
    </div>
  );
}
