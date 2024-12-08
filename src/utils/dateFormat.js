export const formatDateDisplay = (date, fallback = new Date()) => {
  return new Date(date || fallback).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateApi = (dateString) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-CA", options); // 'en-CA' gives 'YYYY-MM-DD'
};

export function combineDateTimeUTC(date, time) {
  const combinedDateTime = new Date(`${date}T${time}Z`);
  return combinedDateTime.toISOString(); // Returns in UTC format
}
