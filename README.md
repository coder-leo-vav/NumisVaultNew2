# NumisVault - Приложение для коллекционирования монет

NumisVault - это современное веб-приложение для управления коллекцией монет, позволяющее пользователям каталогизировать, отслеживать и анализировать свои монетные коллекции.

## Особенности

- Каталогизация монет с подробной информацией (страна, номинал, материал, год выпуска и т.д.)
- Управление коллекциями монет
- Поиск и фильтрация монет
- Аутентификация пользователей
- Интерактивные диаграммы для анализа коллекции
- Современный пользовательский интерфейс в стиле Apple
- RESTful API с полной CRUD операцией
- Поддержка PostgreSQL для хранения данных

## Технологии

### Frontend
- React 18
- Vite
- Tailwind CSS
- Recharts
- Framer Motion
- React Router
- TanStack Query
- Lucide React
- shadcn/ui

### Backend
- Node.js
- Express.js
- PostgreSQL
- pg (PostgreSQL клиент)
- Joi (валидация)
- Passport (аутентификация)

## Структура проекта

```
workspace/
├── backend/                 # Backend приложение
│   ├── config/             # Конфигурация
│   ├── models/             # Модели данных
│   ├── routes/             # API маршруты
│   ├── middleware/         # Промежуточное ПО
│   ├── scripts/            # Скрипты инициализации
│   ├── package.json        # Зависимости backend
│   ├── server.js           # Основной сервер
│   ├── .env.example        # Пример переменных окружения
│   ├── README.md           # Документация backend
│   ├── Dockerfile          # Docker конфигурация backend
│   ├── docker-compose.yml  # Docker конфигурация для разработки
│   ├── init.sql            # Скрипт инициализации базы данных
│   └── test_connection.js  # Скрипт тестирования подключения
├── public/                 # Публичные ресурсы
├── src/                    # Исходный код frontend
│   ├── components/         # React компоненты
│   ├── pages/              # Страницы приложения
│   ├── lib/                # Утилиты
│   ├── utils/              # Вспомогательные функции
│   ├── styles/             # Стили
│   ├── assets/             # Ассеты
│   ├── App.jsx             # Главный компонент
│   └── main.jsx            # Точка входа
├── package.json            # Зависимости frontend
├── package-lock.json       # Блокировка версий зависимостей
├── docker-compose.yml      # Docker конфигурация для всего приложения
├── Dockerfile              # Docker конфигурация frontend
├── nginx.conf              # Конфигурация Nginx
├── APP_SPECIFICATIONS.md   # Технические спецификации приложения
├── DEPLOYMENT_INSTRUCTIONS.md # Инструкции по деплою
└── README.md               # Этот файл
```

## Установка и запуск

### Локальный запуск

#### Требования
- Node.js (v16 или выше)
- npm или yarn
- PostgreSQL (или Docker)

#### Запуск backend части

1. Перейдите в директорию backend:
```bash
cd backend
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл переменных окружения:
```bash
cp .env.example .env
```

4. Настройте параметры подключения к базе данных в файле `.env`

5. Установите и запустите PostgreSQL:
   - Вариант 1: Установите PostgreSQL локально и создайте базу данных `numisvault`
   - Вариант 2: Используйте Docker:
```bash
docker-compose up -d
```

6. Выполните миграции базы данных:
```bash
npm run migrate
```

7. Запустите backend сервер:
```bash
npm run dev
```

#### Запуск frontend части

1. Вернитесь в корневую директорию проекта

2. Установите зависимости:
```bash
npm install
```

3. Запустите frontend:
```bash
npm run dev
```

### Запуск через Docker

Для запуска всего приложения с помощью Docker выполните:

```bash
docker-compose up --build
```

После запуска:
- Frontend будет доступен по адресу `http://localhost`
- Backend будет доступен по адресу `http://localhost:5000`
- База данных будет доступна на порту 5432

## API endpoints

### Монеты
- `GET /api/coins` - получить список монет
- `GET /api/coins/:id` - получить конкретную монету
- `POST /api/coins` - создать новую монету
- `PUT /api/coins/:id` - обновить монету
- `DELETE /api/coins/:id` - удалить монету

### Страны
- `GET /api/countries` - получить список стран
- `GET /api/countries/:id` - получить конкретную страну
- `POST /api/countries` - создать новую страну
- `PUT /api/countries/:id` - обновить страну
- `DELETE /api/countries/:id` - удалить страну

### Номиналы
- `GET /api/denominations` - получить список номиналов
- `GET /api/denominations/:id` - получить конкретный номинал
- `POST /api/denominations` - создать новый номинал
- `PUT /api/denominations/:id` - обновить номинал
- `DELETE /api/denominations/:id` - удалить номинал

### Материалы
- `GET /api/materials` - получить список материалов
- `GET /api/materials/:id` - получить конкретный материал
- `POST /api/materials` - создать новый материал
- `PUT /api/materials/:id` - обновить материал
- `DELETE /api/materials/:id` - удалить материал

### Состояния
- `GET /api/conditions` - получить список состояний
- `GET /api/conditions/:id` - получить конкретное состояние
- `POST /api/conditions` - создать новое состояние
- `PUT /api/conditions/:id` - обновить состояние
- `DELETE /api/conditions/:id` - удалить состояние

### Коллекции
- `GET /api/collections` - получить список коллекций
- `GET /api/collections/:id` - получить конкретную коллекцию
- `GET /api/collections/:id/coins` - получить монеты в коллекции
- `POST /api/collections/:id/add-coin` - добавить монету в коллекцию
- `DELETE /api/collections/:id/remove-coin/:coinId` - удалить монету из коллекции
- `POST /api/collections` - создать новую коллекцию
- `PUT /api/collections/:id` - обновить коллекцию
- `DELETE /api/collections/:id` - удалить коллекцию

### Пользователи
- `POST /api/users/register` - регистрация пользователя
- `POST /api/users/login` - аутентификация пользователя

## База данных

Проект использует PostgreSQL с следующими основными таблицами:

- `coins` - основная таблица монет
- `countries` - страны происхождения монет
- `denominations` - номиналы
- `materials` - материалы изготовления
- `conditions` - состояния монет
- `collections` - коллекции пользователей
- `collection_coins` - связь между коллекциями и монетами
- `users` - пользователи системы

## Развертывание

Для развертывания в продакшене:
1. Настройте переменные окружения для продакшена
2. Используйте SSL-сертификаты
3. Настройте nginx как reverse proxy
4. Обеспечьте резервное копирование базы данных
5. Настройте мониторинг и логирование

Для более подробной информации см. файл `DEPLOYMENT_INSTRUCTIONS.md`.

## Автор

Vododokhov Aleksey

## Лицензия

Этот проект является частью учебного материала и предоставляется как есть без гарантий.