const IST = "Asia/Kolkata";

/**
 * Parse a Supabase timestamp string into a Date object.
 *
 * Supabase may return:
 * - timestamptz: "2026-09-15T15:00:00.000Z"  (has Z → UTC, correct)
 * - timestamp:    "2026-09-15T15:00:00"       (no tz → treat as UTC since Supabase servers are UTC)
 * - date:         "2026-09-15"                (date-only → UTC midnight)
 *
 * JavaScript's `new Date("2026-09-15T15:00:00")` without Z is parsed as LOCAL time,
 * which is wrong if the server stored UTC. This function ensures consistent UTC parsing.
 */
export function parseDate(dateStr: string): Date {
  if (!dateStr) return new Date(0);

  // If already has timezone info (Z or +HH:MM / -HH:MM), parse as-is
  if (/Z$|[+-]\d{2}:\d{2}$/.test(dateStr)) {
    return new Date(dateStr);
  }

  // No timezone info — treat as UTC (Supabase servers are UTC)
  return new Date(dateStr + "Z");
}

/**
 * Format a created_at timestamp as relative time in IST.
 * "Just now" / "5h ago" / "3d ago" / "Sep 10"
 */
export function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = parseDate(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  if (diffMs < 0) return "Just now";

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "Just now";
  if (diffHours < 1) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-IN", {
    timeZone: IST,
    day: "numeric",
    month: "short",
  });
}

/**
 * Format a created_at timestamp as a full IST datetime.
 * "Sep 15, 2026 • 8:30 PM"
 */
export function formatCreatedTimestamp(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = parseDate(dateStr);
  return date.toLocaleDateString("en-IN", {
    timeZone: IST,
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format an event_date (date-only string from <input type="date">) for display.
 * "event_date" is a Postgres DATE — always represents a calendar day.
 *
 * - Today → "Today"
 * - Tomorrow → "Tomorrow"
 * - Within 7 days → "Wednesday" / day name
 * - Otherwise → "Sep 20, 2026"
 */
export function formatEventDate(dateStr: string | null): string {
  if (!dateStr) return "";

  // Parse date-only string as UTC midnight, then convert to IST for date comparison
  const eventDate = parseDate(dateStr + "T00:00:00");
  const now = new Date();

  // Get today/tomorrow in IST for comparison
  const todayIST = new Date(
    now.toLocaleDateString("en-CA", { timeZone: IST })
  ); // "YYYY-MM-DD"
  const eventDateLocal = new Date(
    eventDate.toLocaleDateString("en-CA", { timeZone: IST })
  );

  const diffDays = Math.round(
    (eventDateLocal.getTime() - todayIST.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";

  // Within 7 days, show day name
  if (diffDays > 1 && diffDays <= 7) {
    return eventDate.toLocaleDateString("en-IN", {
      timeZone: IST,
      weekday: "long",
    });
  }

  // Otherwise, show full date
  return eventDate.toLocaleDateString("en-IN", {
    timeZone: IST,
    day: "numeric",
    month: "short",
    year: diffDays < 0 || diffDays > 365 ? "numeric" : undefined,
  });
}

/**
 * Format a date-only string (like event_date or log_date) as a simple date.
 * "Sep 15, 2026"
 */
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = parseDate(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-IN", {
    timeZone: IST,
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
