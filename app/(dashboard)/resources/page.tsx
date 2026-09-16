"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { fetchResources, createResource, deleteResource } from "@/lib/api";
import type { Resource } from "@/lib/supabase/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Plus, ExternalLink, Trash2, FileText } from "lucide-react";
import { formatRelativeTime } from "@/lib/dates";

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Computer Science",
  "English",
  "Other",
];

export default function ResourcesPage() {
  const { isCR } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params: { subject?: string; limit?: number } = { limit: 50 };
    if (subjectFilter !== "all") params.subject = subjectFilter;
    const { data, error: err } = await fetchResources(params);
    if (err) setError(err);
    else setResources(data || []);
    setLoading(false);
  }, [subjectFilter]);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const handleCreate = async (formData: {
    title: string;
    file_url: string;
    subject: string;
  }) => {
    setFormLoading(true);
    setFormError(null);
    const { error: err } = await createResource(formData);
    if (err) {
      setFormError(err);
      setFormLoading(false);
      return;
    }
    setShowForm(false);
    loadResources();
  };

  const handleDelete = async (id: string) => {
    const { error: err } = await deleteResource(id);
    if (!err) {
      setDeleteConfirm(null);
      loadResources();
    }
  };

  const uniqueSubjects = [
    ...new Set(resources.map((r) => r.subject).filter(Boolean)),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resources"
        description="Notes, papers, and study materials"
        action={
          isCR ? (
            <Button size="sm" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Resource
            </Button>
          ) : undefined
        }
      />

      <div className="flex flex-wrap gap-2">
        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
            {uniqueSubjects
              .filter((s) => !subjects.includes(s))
              .map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <ListSkeleton count={3} />
      ) : error ? (
        <ErrorState description={error} onRetry={loadResources} />
      ) : resources.length === 0 ? (
        <EmptyState
          title="No resources"
          description="No study materials have been uploaded yet."
          action={isCR ? "Add Resource" : undefined}
          onAction={isCR ? () => setShowForm(true) : undefined}
        />
      ) : (
        <div className="space-y-3">
          {resources.map((resource) => (
            <Card key={resource.id} className="hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="rounded-lg bg-primary/10 p-2 shrink-0">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-sm truncate">{resource.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                        <Badge variant="secondary" className="text-[10px]">
                          {resource.subject}
                        </Badge>
                        <span>{formatRelativeTime(resource.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <a
                        href={resource.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                    {isCR && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteConfirm(resource.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ResourceFormDialog
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleCreate}
        loading={formLoading}
        error={formError}
      />

      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Resource</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this resource?
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

function ResourceFormDialog({
  open,
  onOpenChange,
  onSubmit,
  loading,
  error,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { title: string; file_url: string; subject: string }) => void;
  loading: boolean;
  error: string | null;
}) {
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [subject, setSubject] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, file_url: fileUrl, subject });
    setTitle("");
    setFileUrl("");
    setSubject("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Resource</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resource-title">Title *</Label>
            <Input
              id="resource-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resource title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resource-url">File URL *</Label>
            <Input
              id="resource-url"
              type="url"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Subject *</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !subject}>
              {loading ? "Adding..." : "Add Resource"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
