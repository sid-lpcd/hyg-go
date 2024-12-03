export const getNumbers = (text, index) => {
  return text
    .match(/\d+\.?\d*/g)
    .map(Number)
    .map(Math.floor)[index];
};
