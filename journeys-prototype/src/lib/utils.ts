import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseReminder(text: string): string {
  const t = text.trim();
  if (!t) return "No reminders";
  const dayMatch = t.match(
    /\b(mondays?|tuesdays?|wednesdays?|thursdays?|fridays?|saturdays?|sundays?|daily|every\s+day|weekly|every\s+week|monthly|every\s+month|biweekly)\b/i,
  );
  const timeMatch = t.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i);
  if (!dayMatch && !timeMatch) return "No reminders";
  const day = dayMatch ? dayMatch[0].replace(/\b\w/g, (c) => c.toUpperCase()) : "";
  let time = "";
  if (timeMatch) {
    const h = timeMatch[1];
    const m = timeMatch[2] ?? "00";
    const ap = (timeMatch[3] ?? "").toLowerCase();
    time = ap ? `${h}${m !== "00" ? ":" + m : ""}${ap}` : `${h}:${m}`;
  }
  return [day, time && `at ${time}`].filter(Boolean).join(" ");
}
