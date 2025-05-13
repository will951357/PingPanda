export const parseColor = (color: string) => {
  const hex = color.startsWith("#") ? color.slice(1) : color;

  return parseInt(hex, 16);
}