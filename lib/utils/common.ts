import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function delay(delayTime: number = 2) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, delayTime * 1000);
  });
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
