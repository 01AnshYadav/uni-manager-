"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { fetchDailyLogs, createDailyLog, deleteDailyLog } from "@/lib/api";
import type { DailyLog } from "@/lib/supabase/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/shared/page-header";
import { ListSkeleton } from "@/components/shared/loading";
import { ErrorState, EmptyState } from "@/components/shared/states";
import {
  Plus,
  Trash2,
  CalendarDays,
  Image as ImageIcon,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/dates";

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00Z").toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function groupByDate(logs: DailyLog[]) {
  const groups: { [key: string]: DailyLog[] } = {};
  for (const log of logs) {
    const dateKey = log.log_date;
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(log);
  }
  return groups;
}

export default function DailyLogsPage() {
  const { isCR } = useAuth();
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await fetchDailyLogs({ limit: 50 });
    if (err) setError(err);
    else setLogs(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const handleCreate = async (formData: {
    log_date: string;
    subject: string;
    summary: string;
  }) => {
    setFormLoading(true);
    setFormError(null);
    const { error: err } = await createDailyLog({
      log_date: formData.log_date,
      subject: formData.subject || undefined,
      summary: formData.summary || undefined,
    });
    if (err) {
      setFormError(err);
      setFormLoading(false);
      return;
    }
    setShowForm(false);
    loadLogs();
  };

  const handleDelete = async (id: string) => {
    const { error: err } = await deleteDailyLog(id);
    if (!err) {
      setDeleteConfirm(null);
      loadLogs();
    }
  };

  const grouped = groupByDate(logs);
  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Logs"
        description="What happened in each class"
        action={
          isCR ? (
            <Button size="sm" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Log
            </Button>
          ) : undefined
        }
      />

      {loading ? (
        <ListSkeleton count={3} />
      ) : error ? (
        <ErrorState description={error} onRetry={loadLogs} />
      ) : logs.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No daily logs"
          description="No class logs have been posted yet."
          action={isCR ? "Add Log" : undefined}
          onAction={isCR ? () => setShowForm(true) : undefined}
        />
      ) : (
        <div className="space-y-8">
          {sortedDates.map((dateKey) => (
            <div key={dateKey} className="space-y-3">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold text-muted-foreground">
                  {formatDate(dateKey)}
                </h2>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="space-y-3 pl-4 border-l-2 border-border">
                {grouped[dateKey].map((log) => (
                  <Card key={log.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-sm">
                              {log.subject || "Class Log"}
                            </h3>
                          </div>
                          {log.summary && (
                            <p className="text-sm text-muted-foreground mt-1.5 whitespace-pre-line">
                              {log.summary}
                            </p>
                          )}
                          {log.photo_urls && log.photo_urls.length > 0 && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                              <ImageIcon className="h-3 w-3" />
                              {log.photo_urls.length} photo
                              {log.photo_urls.length > 1 ? "s" : ""}
                            </div>
                          )}
                          <div className="mt-2 text-xs text-muted-foreground">
                            {formatRelativeTime(log.created_at)}
                          </div>
                        </div>
                        {isCR && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive shrink-0"
                            onClick={() => setDeleteConfirm(log.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <DailyLogFormDialog
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleCreate}
        loading={formLoading}
        error={formError}
      />

      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Daily Log</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this daily log?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DailyLogFormDialog({
  open,
  onOpenChange,
  onSubmit,
  loading,
  error,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { log_date: string; subject: string; summary: string }) => void;
  loading: boolean;
  error: string | null;
}) {
  const [logDate, setLogDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [subject, setSubject] = useState("");
  const [summary, setSummary] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ log_date: logDate, subject, summary });
    setSubject("");
    setSummary("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Daily Log</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="log-date">Date *</Label>
            <Input
              id="log-date"
              type="date"
              value={logDate}
              onChange={(e) => setLogDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="log-subject">Subject</Label>
            <Input
              id="log-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Mathematics, Physics..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="log-summary">Summary</Label>
            <textarea
              id="log-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="What was covered in class?"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Log"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
