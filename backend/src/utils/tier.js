export const getTier = (points) => {
  if (points >= 20000) return 'Platinum';
  if (points >= 5000) return 'Gold';
  return 'Silver';
};
