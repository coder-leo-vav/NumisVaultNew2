/**
 * @file utils/index.js
 * @description Утилиты для всего приложения
 * @author Vododokhov Aleksey
 */

/**
 * Функция для создания URL страниц
 * @param {string} pageName - Название страницы или путь
 * @returns {string} Полный путь до страницы
 */
export function createPageUrl(pageName) {
  // Если pageName уже содержит ?, значит это параметризованный маршрут
  if (pageName.includes('?')) {
    const [basePath, queryParams] = pageName.split('?');
    return `/${basePath.toLowerCase()}?${queryParams}`;
  }
  
  // Для обычных страниц просто возвращаем путь в нижнем регистре
  return `/${pageName.toLowerCase()}`;
}

/**
 * Форматирование даты в соответствии с настройками пользователя
 * @param {Date|string} date - Дата для форматирования
 * @param {string} format - Формат (например, 'DD.MM.YYYY')
 * @returns {string} Отформатированная дата
 */
export function formatDate(date, format = 'DD.MM.YYYY') {
  const d = new Date(date);
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
  const year = d.getFullYear();
  
  // Поддержка только DD.MM.YYYY формата по умолчанию
  if (format === 'DD.MM.YYYY') {
    return `${day}.${month}.${year}`;
  }
  
  // Возврат в ISO формате если неизвестный формат
  return d.toISOString().split('T')[0];
}

/**
 * Генерация уникального ID
 * @returns {string} Уникальный идентификатор
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Валидация email
 * @param {string} email - Email для проверки
 * @returns {boolean} Результат валидации
 */
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Форматирование числа как валюты
 * @param {number} amount - Сумма
 * @param {string} currency - Валюта
 * @returns {string} Отформатированная валюта
 */
export function formatCurrency(amount, currency = 'RUB') {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}