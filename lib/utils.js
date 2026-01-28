/**
 * @file lib/utils.js
 * @description Вспомогательные функции для всего приложения
 * @author Vododokhov Aleksey
 */

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Объединяет классы CSS с помощью clsx и tailwind-merge
 * @param {...any} inputs - Входные параметры для объединения классов
 * @returns {string} Объединенные CSS классы
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}