export const formatDateTripDisplay = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const options = { day: "2-digit", month: "short", year: "2-digit" };

  if (
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth()
  ) {
    return `${start.toLocaleDateString("en-GB", {
      day: "2-digit",
    })} - ${end.toLocaleDateString("en-GB", options)}`;
  }

  if (start.getFullYear() === end.getFullYear()) {
    return `${start.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    })} - ${end.toLocaleDateString("en-GB", options)}`;
  }

  return `${start.toLocaleDateString(
    "en-GB",
    options
  )} - ${end.toLocaleDateString("en-GB", options)}`;
};

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
  // Regular Expression to validate the expected date format
  const validFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  if (!validFormat.test(date)) {
    const combinedDateTime = new Date(`${date}T${time}Z`);

    return combinedDateTime.toISOString(); // Returns in UTC format
  }
  return date;
}
