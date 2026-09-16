"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { fetchPosts, fetchResources, fetchDailyLogs } from "@/lib/api";
import type { Post, Resource, DailyLog } from "@/lib/supabase/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { ListSkeleton } from "@/components/shared/loading";
import { ErrorState, EmptyState } from "@/components/shared/states";
import {
  AlertTriangle,
  Megaphone,
  BookOpen,
  CalendarDays,
  ArrowRight,
  Clock,
} from "lucide-react";
import Link from "next/link";
import {
  formatRelativeTime,
  formatEventDate,
  formatDate,
} from "@/lib/dates";

export default function DashboardPage() {
  const { user } = useAuth();
  const [urgentPosts, setUrgentPosts] = useState<Post[]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [recentResources, setRecentResources] = useState<Resource[]>([]);
  const [recentLogs, setRecentLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [postsRes, resourcesRes, logsRes] = await Promise.all([
        fetchPosts({ limit: 10 }),
        fetchResources({ limit: 5 }),
        fetchDailyLogs({ limit: 5 }),
      ]);

      if (postsRes.error) {
        setError(postsRes.error);
        return;
      }

      const allPosts = postsRes.data || [];
      setUrgentPosts(allPosts.filter((p) => p.priority === "urgent"));
      setLatestPosts(allPosts.filter((p) => p.priority !== "urgent").slice(0, 5));
      setRecentResources(resourcesRes.data || []);
      setRecentLogs(logsRes.data || []);
    } catch {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" />
        <ListSkeleton count={2} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" />
        <ErrorState description={error} onRetry={loadData} />
      </div>
    );
  }

  const firstName = user?.email?.split("@")[0] || "there";
  const hasUrgent = urgentPosts.length > 0;
  const hasContent = latestPosts.length > 0 || recentResources.length > 0 || recentLogs.length > 0;

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        title={`Welcome, ${firstName}`}
        description="Here's what's happening in your batch"
      />

      {hasUrgent && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <h2 className="text-sm font-semibold uppercase tracking-wide">Urgent</h2>
          </div>
          <div className="space-y-3">
            {urgentPosts.map((post) => (
              <Link key={post.id} href={`/announcements?id=${post.id}`}>
                <Card className="border-destructive/20 hover:border-destructive/40 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <h3 className="font-semibold text-sm leading-snug">{post.title}</h3>
                        {post.body && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {post.body}
                          </p>
                        )}
                      </div>
                      <Badge variant="destructive" className="shrink-0 text-[10px]">
                        Urgent
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      {post.category && <span>{post.category}</span>}
                      {post.event_date && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatEventDate(post.event_date)}
                        </span>
                      )}
                      <span>{formatRelativeTime(post.created_at)}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {!hasContent && (
        <EmptyState
          title="All clear"
          description="No announcements, resources, or logs yet. Check back soon!"
        />
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {latestPosts.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                <Megaphone className="h-4 w-4" />
                Latest Announcements
              </h2>
              <Link
                href="/announcements"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {latestPosts.map((post) => (
                <Link key={post.id} href={`/announcements?id=${post.id}`}>
                  <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-medium text-sm truncate">{post.title}</h3>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            {post.category && (
                              <Badge variant="secondary" className="text-[10px]">
                                {post.category}
                              </Badge>
                            )}
                            <span>{formatRelativeTime(post.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {recentResources.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Recent Resources
              </h2>
              <Link
                href="/resources"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {recentResources.map((resource) => (
                <Card key={resource.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-3">
                    <h3 className="font-medium text-sm truncate">{resource.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="text-[10px]">
                        {resource.subject}
                      </Badge>
                      <span>{formatRelativeTime(resource.created_at)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {recentLogs.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Recent Daily Logs
              </h2>
              <Link
                href="/daily-logs"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {recentLogs.map((log) => (
                <Card key={log.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-medium text-sm">
                          {log.subject || "Class Log"}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDate(log.log_date)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
