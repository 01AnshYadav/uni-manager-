"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { fetchStudents, createStudent } from "@/lib/api";
import type { Student } from "@/lib/supabase/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/shared/page-header";
import { ListSkeleton } from "@/components/shared/loading";
import { ErrorState, EmptyState } from "@/components/shared/states";
import { Plus, Users } from "lucide-react";

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function StudentsPage() {
  const { isCR } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await fetchStudents({ limit: 100 });
    if (err) setError(err);
    else setStudents(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const handleCreate = async (formData: {
    name: string;
    phone_or_telegram: string;
  }) => {
    setFormLoading(true);
    setFormError(null);
    const { error: err } = await createStudent(formData);
    if (err) {
      setFormError(err);
      setFormLoading(false);
      return;
    }
    setShowForm(false);
    loadStudents();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description={`${students.length} student${students.length !== 1 ? "s" : ""} in your batch`}
        action={
          isCR ? (
            <Button size="sm" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Student
            </Button>
          ) : undefined
        }
      />

      {loading ? (
        <ListSkeleton count={3} />
      ) : error ? (
        <ErrorState description={error} onRetry={loadStudents} />
      ) : students.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students yet"
          description="No students have been registered yet."
          action={isCR ? "Add Student" : undefined}
          onAction={isCR ? () => setShowForm(true) : undefined}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <Card key={student.id} className="hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 h-10 w-10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-semibold text-sm">
                      {student.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm truncate">{student.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {student.phone_or_telegram}
                    </p>
                    {student.joined_at && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Joined {formatDate(student.joined_at)}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <StudentFormDialog
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleCreate}
        loading={formLoading}
        error={formError}
      />
    </div>
  );
}

function StudentFormDialog({
  open,
  onOpenChange,
  onSubmit,
  loading,
  error,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; phone_or_telegram: string }) => void;
  loading: boolean;
  error: string | null;
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, phone_or_telegram: contact });
    setName("");
    setContact("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student-name">Name *</Label>
            <Input
              id="student-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Student name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="student-contact">Phone / Telegram *</Label>
            <Input
              id="student-contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Phone number or Telegram handle"
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Student"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
