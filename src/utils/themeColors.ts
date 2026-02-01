export const getDayColors = (): string[] => {
  return [
    getComputedStyle(document.documentElement).getPropertyValue('--day-color-1').trim() || '#6e4176',
    getComputedStyle(document.documentElement).getPropertyValue('--day-color-2').trim() || '#5d1376',
    getComputedStyle(document.documentElement).getPropertyValue('--day-color-3').trim() || '#cdacd2',
    getComputedStyle(document.documentElement).getPropertyValue('--day-color-4').trim() || '#d25ded',
    getComputedStyle(document.documentElement).getPropertyValue('--day-color-5').trim() || '#3d3d3d',
    getComputedStyle(document.documentElement).getPropertyValue('--day-color-6').trim() || '#510b68',
    getComputedStyle(document.documentElement).getPropertyValue('--day-color-7').trim() || '#155724',
    getComputedStyle(document.documentElement).getPropertyValue('--day-color-8').trim() || '#721c24'
  ];
};

export const getDayColor = (dayNumber: number): string => {
  const colors = getDayColors();
  const index = Math.max(0, Math.min(colors.length - 1, dayNumber - 1));
  return colors[index];
};


export const FALLBACK_DAY_COLORS = [
  '#6e4176', // Day 1 - Purple shade
  '#5d1376', // Day 2 - Deeper purple  
  '#cdacd2', // Day 3 - Light purple
  '#d25ded', // Day 4 - Bright purple
  '#3d3d3d', // Day 5 - Dark gray
  '#510b68', // Day 6 - Dark purple
  '#155724', // Day 7 - Dark green
  '#721c24'  // Day 8 - Dark red
];