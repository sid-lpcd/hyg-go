export const getNumbers = (text, index) => {
  return text
    .match(/\d+\.?\d*/g)
    .map(Number)
    .map(Math.floor)[index];
};

export const calcLength = (startDate, endDate) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  // Assume 15hrs per day
  return Math.round(((end - start) / (1000 * 60 * 60 * 24)) * 15) + 1;
};
