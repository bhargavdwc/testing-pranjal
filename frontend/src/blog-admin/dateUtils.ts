/**
 * Utilities for formatting and parsing local datetime for HTML5 datetime-local inputs
 * and converting accurately to/from UTC ISO strings without timezone offsets issues.
 */

export const formatToLocalDatetimeInput = (dateInput: string | Date | null | undefined): string => {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const parseLocalDatetimeToISO = (localDatetimeStr: string): string => {
  if (!localDatetimeStr) return "";
  const [datePart, timePart] = localDatetimeStr.split("T");
  if (!datePart || !timePart) {
    const d = new Date(localDatetimeStr);
    return isNaN(d.getTime()) ? "" : d.toISOString();
  }
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);
  const localDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
  if (isNaN(localDate.getTime())) return "";
  return localDate.toISOString();
};

export const formatDisplayDateTime = (dateInput: string | Date | null | undefined): string => {
  if (!dateInput) return "—";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Ensures a scheduled time is at least 1 minute in the future from current time.
 * If current time is :55, returns :56.
 * If existing time is already in the future, keeps it.
 */
export const getNextMinuteLocalDatetime = (existing?: string | Date | null): string => {
  const now = new Date();
  if (existing) {
    const d = new Date(existing);
    if (!isNaN(d.getTime()) && d.getTime() > now.getTime()) {
      return formatToLocalDatetimeInput(d);
    }
  }
  const plusOneMin = new Date(now.getTime() + 60 * 1000);
  plusOneMin.setSeconds(0, 0);
  return formatToLocalDatetimeInput(plusOneMin);
};
