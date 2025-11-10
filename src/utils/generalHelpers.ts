export const getNumbers = (text: string, index: number): number => {
  return text
    .match(/\d+\.?\d*/g)
    ?.map(Number)
    ?.map(Math.floor)[index] ?? 0;
};

export const computeAvailableHoursWithinDates = (startDate: Date, endDate: Date): number => {
  const start = startDate.getTime();
  const end = endDate.getTime();

  if (end < start) {
    throw new Error("End date must be after start date");
  }

  // Assume 15hrs per day
  return Math.round(((end - start) / (1000 * 60 * 60 * 24)) * 15) + 1;
};