export const generateRandomChar = (chars: string) => {
  return chars[Math.floor(Math.random() * chars.length)];
};

export const randomRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};
