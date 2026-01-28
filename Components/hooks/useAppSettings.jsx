/**
 * @file useAppSettings.js
 * @description Хук для управления настройками приложения (валюта, тема, язык)
 * @author Vododokhov Aleksey
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

/**
 * Хук для работы с настройками приложения
 * @returns {Object} Объект с настройками и методами для работы с ними
 * @property {Object} settings - Текущие настройки приложения
 * @property {boolean} isLoading - Флаг загрузки настроек
 * @property {Function} updateSettings - Функция для обновления настроек
 * @property {boolean} isUpdating - Флаг процесса обновления
 * @property {Function} formatPrice - Функция форматирования цены
 */
export function useAppSettings() {
  const queryClient = useQueryClient();

  const { data: settingsArray, isLoading } = useQuery({
    queryKey: ['appSettings'],
    queryFn: () => base44.entities.AppSettings.list(),
  });

  const settings = settingsArray?.[0] || {
    currency: 'RUB',
    currency_symbol: '₽',
    language: 'ru',
    theme: 'light',
    date_format: 'DD.MM.YYYY'
  };

  const updateSettings = useMutation({
    mutationFn: async (newSettings) => {
      if (settingsArray?.[0]?.id) {
        return base44.entities.AppSettings.update(settingsArray[0].id, newSettings);
      } else {
        return base44.entities.AppSettings.create(newSettings);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appSettings'] });
    }
  });

  const formatPrice = (value) => {
    if (value === null || value === undefined) return '—';
    return `${Number(value).toLocaleString('ru-RU')} ${settings.currency_symbol}`;
  };

  return {
    settings,
    isLoading,
    updateSettings: updateSettings.mutate,
    isUpdating: updateSettings.isPending,
    formatPrice
  };
}