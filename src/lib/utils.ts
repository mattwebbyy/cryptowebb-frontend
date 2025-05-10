// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Function to merge Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Your existing utility functions
export const generateRandomChar = (chars: string): string => {
  return chars[Math.floor(Math.random() * chars.length)];
};

export const randomRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

