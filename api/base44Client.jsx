/**
 * @file base44Client.js
 * @description Клиент для взаимодействия с Base44 BaaS
 * @author Vododokhov Aleksey
 */

/**
 * Mock client для локальной разработки
 */
export const base44 = {
  entities: {
    Collectible: {
      list: async () => {
        // Возвращаем заглушку для локальной разработки
        return [
          {
            id: '1',
            name: 'Георгий Победоносец',
            type: 'coin',
            country: 'Россия',
            year: 2020,
            denomination: '25',
            currency: 'рублей',
            condition: 'UNC',
            purchase_price: 3500,
            current_value: 4200,
            purchase_date: '2021-05-15',
            front_image: '',
            back_image: '',
            description: 'Памятная инвестиционная монета России «Георгий Победоносец»',
            description_en: 'Memorial investment coin of Russia "Saint George the Victorious"',
            notes: 'Особое исполнение',
            tags: ['Редкая', 'Золото'],
            category_id: '1',
            material: 'Золото',
            weight: 7.78,
            diameter: 22.5,
            mint: 'Гознак',
            catalog_number: 'Y# 123',
            is_favorite: true,
            status: 'in_collection'
          },
          {
            id: '2',
            name: 'Рубль Петра I',
            type: 'coin',
            country: 'Россия',
            year: 1704,
            denomination: '1',
            currency: 'рубль',
            condition: 'VF',
            purchase_price: 15000,
            current_value: 18000,
            purchase_date: '2022-01-10',
            front_image: '',
            back_image: '',
            description: 'Монета времён Петра I, один из символов эпохи реформ',
            description_en: 'Coin from Peter the Great\'s era, one of the symbols of the reform epoch',
            notes: 'Историческая ценность',
            tags: ['Редкая', 'Серебро', 'Историческая'],
            category_id: '3',
            material: 'Серебро',
            weight: 28.0,
            diameter: 35.0,
            mint: 'Московский монетный двор',
            catalog_number: 'Y# 456',
            is_favorite: true,
            status: 'in_collection'
          }
        ];
      },
      get: async (id) => {
        // Возвращаем заглушку для локальной разработки
        return {
          id,
          name: 'Тестовая монета',
          type: 'coin',
          country: 'Россия',
          year: 2024,
          denomination: '10',
          currency: 'рублей',
          condition: 'UNC',
          purchase_price: 1000,
          current_value: 1200,
          purchase_date: '2024-01-01',
          front_image: '',
          back_image: '',
          description: 'Тестовая запись для разработки',
          description_en: 'Test record for development',
          notes: 'Заметка для теста',
          tags: ['Тест', 'Заглушка'],
          category_id: '1',
          material: 'Медь',
          weight: 5.0,
          diameter: 25.0,
          mint: 'Тестовый двор',
          catalog_number: 'TEST# 001',
          is_favorite: false,
          status: 'in_collection'
        };
      },
      create: async (data) => {
        // Возвращаем заглушку для локальной разработки
        return { id: Date.now().toString(), ...data };
      },
      update: async (id, data) => {
        // Возвращаем заглушку для локальной разработки
        return { id, ...data };
      },
      delete: async (id) => {
        // Возвращаем заглушку для локальной разработки
        return { success: true };
      }
    },
    Category: {
      list: async () => {
        // Возвращаем заглушку для локальной разработки
        return [
          {
            id: '1',
            name: 'Памятные монеты',
            type: 'coin',
            color: '#FF6B6B',
            icon: '纪念币',
            description: 'Памятные и юбилейные монеты'
          },
          {
            id: '2',
            name: 'Инвестиционные монеты',
            type: 'coin',
            color: '#4ECDC4',
            icon: '金条',
            description: 'Инвестиционные золотые и серебряные монеты'
          },
          {
            id: '3',
            name: 'Античные монеты',
            type: 'coin',
            color: '#45B7D1',
            icon: '古罗马',
            description: 'Древние монеты различных цивилизаций'
          },
          {
            id: '4',
            name: 'Советские банкноты',
            type: 'banknote',
            color: '#96CEB4',
            icon: '苏联',
            description: 'Банкноты СССР различных лет'
          },
          {
            id: '5',
            name: 'Военные награды',
            type: 'medal',
            color: '#FFEAA7',
            icon: '勋章',
            description: 'Военные медали и ордена'
          }
        ];
      },
      get: async (id) => {
        // Возвращаем заглушку для локальной разработки
        return {
          id,
          name: 'Тестовая категория',
          type: 'all',
          color: '#1D1D1F',
          icon: '🔧',
          description: 'Тестовая категория для разработки'
        };
      },
      create: async (data) => {
        // Возвращаем заглушку для локальной разработки
        return { id: Date.now().toString(), ...data };
      },
      update: async (id, data) => {
        // Возвращаем заглушку для локальной разработки
        return { id, ...data };
      },
      delete: async (id) => {
        // Возвращаем заглушку для локальной разработки
        return { success: true };
      }
    },
    Tag: {
      list: async () => {
        // Возвращаем заглушку для локальной разработки
        return [
          {
            id: '1',
            name: 'Редкая',
            color: '#FF3B30'
          },
          {
            id: '2',
            name: 'Серебро',
            color: '#C7C7CC'
          },
          {
            id: '3',
            name: 'Золото',
            color: '#FFCC00'
          },
          {
            id: '4',
            name: 'СССР',
            color: '#FF9500'
          },
          {
            id: '5',
            name: 'Россия',
            color: '#5856D6'
          },
          {
            id: '6',
            name: 'Proof',
            color: '#AF52DE'
          }
        ];
      },
      get: async (id) => {
        // Возвращаем заглушку для локальной разработки
        return {
          id,
          name: 'Тестовый тег',
          color: '#1D1D1F'
        };
      },
      create: async (data) => {
        // Возвращаем заглушку для локальной разработки
        return { id: Date.now().toString(), ...data };
      },
      update: async (id, data) => {
        // Возвращаем заглушку для локальной разработки
        return { id, ...data };
      },
      delete: async (id) => {
        // Возвращаем заглушку для локальной разработки
        return { success: true };
      }
    },
    ActivityLog: {
      list: async () => {
        // Возвращаем заглушку для локальной разработки
        return [
          {
            id: '1',
            action: 'create',
            entity_type: 'Collectible',
            entity_id: '1',
            entity_name: 'Георгий Победоносец',
            details: 'Создание новой записи',
            old_values: {},
            new_values: { name: 'Георгий Победоносец' },
            timestamp: new Date().toISOString()
          }
        ];
      },
      get: async (id) => {
        // Возвращаем заглушку для локальной разработки
        return {
          id,
          action: 'test',
          entity_type: 'Test',
          entity_id: '1',
          entity_name: 'Тест',
          details: 'Тестовая запись',
          old_values: {},
          new_values: {},
          timestamp: new Date().toISOString()
        };
      },
      create: async (data) => {
        // Возвращаем заглушку для локальной разработки
        return { id: Date.now().toString(), ...data };
      },
      update: async (id, data) => {
        // Возвращаем заглушку для локальной разработки
        return { id, ...data };
      },
      delete: async (id) => {
        // Возвращаем заглушку для локальной разработки
        return { success: true };
      }
    },
    AppSettings: {
      list: async () => {
        // Возвращаем заглушку для локальной разработки
        return [
          {
            id: '1',
            currency: 'RUB',
            currency_symbol: '₽',
            language: 'ru',
            theme: 'light',
            date_format: 'DD.MM.YYYY'
          }
        ];
      },
      get: async (id) => {
        // Возвращаем заглушку для локальной разработки
        return {
          id,
          currency: 'RUB',
          currency_symbol: '₽',
          language: 'ru',
          theme: 'light',
          date_format: 'DD.MM.YYYY'
        };
      },
      create: async (data) => {
        // Возвращаем заглушку для локальной разработки
        return { id: Date.now().toString(), ...data };
      },
      update: async (id, data) => {
        // Возвращаем заглушку для локальной разработки
        return { id, ...data };
      },
      delete: async (id) => {
        // Возвращаем заглушку для локальной разработки
        return { success: true };
      }
    }
  },
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        // Возвращаем заглушку для локальной разработки
        return { file_url: 'https://via.placeholder.com/300' };
      },
      InvokeLLM: async ({ prompt, file_urls, response_json_schema }) => {
        // Возвращаем заглушку для локальной разработки
        if(prompt.includes('описание') || prompt.includes('опиши')) {
          return { description: 'Тестовое описание, сгенерированное AI для локальной разработки.' };
        } else if(prompt.includes('тегов') || prompt.includes('теги')) {
          return { tags: ['Тест', 'Заглушка'] };
        } else if(prompt.includes('перевести') || prompt.includes('English')) {
          return { translation: 'Test description generated for local development.' };
        } else {
          return { name: 'Тестовый предмет', country: 'Россия', year: 2024, denomination: '10', currency: 'руб.', material: 'Металл', condition: 'UNC', description: 'Тестовое описание', tags: ['Тест'] };
        }
      },
      ExtractDataFromUploadedFile: async ({ file_url }) => {
        // Возвращаем заглушку для локальной разработки
        return { data: [] };
      }
    }
  }
};