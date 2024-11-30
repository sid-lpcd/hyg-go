export const formatDate = (date, fallback = new Date()) => {
  return new Date(date || fallback).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
