import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseReminder(text: string): string {
  const t = text.trim();
  if (!t) return "No reminders";
  
  const tLower = t.toLowerCase();
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "daily", "weekly", "monthly", "biweekly"];
  let matchedDay = "";
  for (const day of days) {
    if (tLower.includes(day)) {
      matchedDay = day.charAt(0).toUpperCase() + day.slice(1);
      break;
    }
  }
  
  if (tLower.includes("every day")) matchedDay = "Daily";
  if (tLower.includes("every week")) matchedDay = "Weekly";
  if (tLower.includes("every month")) matchedDay = "Monthly";

  const simpleTimeMatch = t.match(/([0-2]?\d)(?::([0-5]\d))?\s*(am|pm)?/i);
  let matchedTime = "";
  if (simpleTimeMatch) {
    const h = simpleTimeMatch[1];
    const m = simpleTimeMatch[2] ?? "00";
    const ap = (simpleTimeMatch[3] ?? "").toLowerCase();
    matchedTime = ap ? `${h}${m !== "00" ? ":" + m : ""}${ap}` : `${h}:${m}`;
  }

  if (!matchedDay && !matchedTime) {
    return "No reminders";
  }

  return [matchedDay, matchedTime && `at ${matchedTime}`].filter(Boolean).join(" ");
}
