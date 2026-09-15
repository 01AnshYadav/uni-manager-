"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { fetchPosts, createPost, updatePost, deletePost } from "@/lib/api";
import type { Post } from "@/lib/supabase/types";
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
import {
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  Clock,
} from "lucide-react";
import {
  formatRelativeTime,
  formatEventDate,
} from "@/lib/dates";

const categories = [
  "General",
  "Academic",
  "Exam",
  "Event",
  "Assignment",
  "Placement",
  "Other",
];

export default function AnnouncementsPage() {
  const { isCR } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params: { category?: string; priority?: string; limit?: number } = {
      limit: 50,
    };
    if (filter !== "all") params.category = filter;
    if (priorityFilter !== "all") params.priority = priorityFilter;
    const { data, error: err } = await fetchPosts(params);
    if (err) setError(err);
    else setPosts(data || []);
    setLoading(false);
  }, [filter, priorityFilter]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleCreate = async (formData: {
    title: string;
    body: string;
    priority: string;
    category: string;
    event_date: string;
  }) => {
    setFormLoading(true);
    setFormError(null);
    const { error: err } = await createPost({
      ...formData,
      event_date: formData.event_date || undefined,
      category: formData.category || undefined,
      body: formData.body || undefined,
    });
    if (err) {
      setFormError(err);
      setFormLoading(false);
      return;
    }
    setShowForm(false);
    loadPosts();
  };

  const handleUpdate = async (formData: {
    title: string;
    body: string;
    priority: string;
    category: string;
    event_date: string;
  }) => {
    if (!editingPost) return;
    setFormLoading(true);
    setFormError(null);
    const { error: err } = await updatePost(editingPost.id, {
      ...formData,
      event_date: formData.event_date || undefined,
      category: formData.category || undefined,
      body: formData.body || undefined,
    });
    if (err) {
      setFormError(err);
      setFormLoading(false);
      return;
    }
    setEditingPost(null);
    loadPosts();
  };

  const handleDelete = async (id: string) => {
    const { error: err } = await deletePost(id);
    if (!err) {
      setDeleteConfirm(null);
      loadPosts();
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        description="Stay updated with your batch"
        action={
          isCR ? (
            <Button size="sm" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-1" />
              New Post
            </Button>
          ) : undefined
        }
      />

      <div className="flex flex-wrap gap-2">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <ListSkeleton count={3} />
      ) : error ? (
        <ErrorState description={error} onRetry={loadPosts} />
      ) : posts.length === 0 ? (
        <EmptyState
          title="No announcements"
          description="No posts match your current filters."
          action={isCR ? "Create Post" : undefined}
          onAction={isCR ? () => setShowForm(true) : undefined}
        />
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Card
              key={post.id}
              className={
                post.priority === "urgent"
                  ? "border-destructive/20"
                  : ""
              }
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {post.priority === "urgent" && (
                        <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />
                      )}
                      <h3 className="font-semibold text-sm leading-snug">
                        {post.title}
                      </h3>
                    </div>
                    {post.body && (
                      <p className="text-sm text-muted-foreground mt-1.5 whitespace-pre-line">
                        {post.body}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <Badge
                        variant={
                          post.priority === "urgent" ? "destructive" : "secondary"
                        }
                        className="text-[10px]"
                      >
                        {post.priority}
                      </Badge>
                      {post.category && (
                        <Badge variant="outline" className="text-[10px]">
                          {post.category}
                        </Badge>
                      )}
                      {post.event_date ? (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatEventDate(post.event_date)}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(post.created_at)}
                        </span>
                      )}
                    </div>
                  </div>
                  {isCR && (
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setEditingPost(post)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteConfirm(post.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <PostFormDialog
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleCreate}
        loading={formLoading}
        error={formError}
      />

      {editingPost && (
        <PostFormDialog
          open={!!editingPost}
          onOpenChange={(open) => !open && setEditingPost(null)}
          onSubmit={handleUpdate}
          loading={formLoading}
          error={formError}
          initialData={editingPost}
        />
      )}

      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this post? This action cannot be undone.
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

function PostFormDialog({
  open,
  onOpenChange,
  onSubmit,
  loading,
  error,
  initialData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    title: string;
    body: string;
    priority: string;
    category: string;
    event_date: string;
  }) => void;
  loading: boolean;
  error: string | null;
  initialData?: Post;
}) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [body, setBody] = useState(initialData?.body || "");
  const [priority, setPriority] = useState(initialData?.priority || "normal");
  const [category, setCategory] = useState(initialData?.category || "");
  const [eventDate, setEventDate] = useState(initialData?.event_date || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, body, priority, category, event_date: eventDate });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Post" : "New Post"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="body">Body</Label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="What's this about?"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority *</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="event_date">Event Date</Label>
            <Input
              id="event_date"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : initialData ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
