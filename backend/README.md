# NumisVault Backend

Backend API для приложения NumisVault - коллекционного каталога монет.

## Установка

1. Скопируйте файл `.env.example` в `.env` и настройте переменные окружения:
```bash
cp .env.example .env
```

2. Установите зависимости:
```bash
npm install
```

3. Установите и запустите PostgreSQL, если он еще не установлен

4. Запустите миграции базы данных:
```bash
npm run migrate
```

5. Запустите сервер:
```bash
npm run dev
```

## Конфигурация базы данных

Убедитесь, что у вас установлен PostgreSQL и создана база данных. По умолчанию приложение ожидает:
- Имя пользователя: `postgres`
- Пароль: `postgres`
- Имя базы данных: `numisvault`
- Порт: `5432`

Если вы используете другие параметры, обновите файл `.env`.

## API Endpoints

### Монеты
- `GET /api/coins` - получить список монет с фильтрацией и пагинацией
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

## Фильтрация и пагинация

Для получения списка монет можно использовать следующие параметры запроса:
- `page` - номер страницы (по умолчанию 1)
- `limit` - количество элементов на странице (по умолчанию 10)
- `search` - строка поиска по имени или описанию
- `sortBy` - поле для сортировки (по умолчанию id)
- `sortOrder` - направление сортировки (ASC или DESC)
- `countryId` - фильтр по стране
- `denominationId` - фильтр по номиналу
- `materialId` - фильтр по материалу
- `conditionId` - фильтр по состоянию

## Структура проекта

```
backend/
├── server.js                 # Основной серверный файл
├── config/
│   └── db.js                 # Конфигурация базы данных
├── models/                   # Модели данных
│   ├── Coin.js
│   ├── Country.js
│   ├── Denomination.js
│   ├── Material.js
│   └── Condition.js
├── routes/                   # API маршруты
│   ├── coinRoutes.js
│   ├── countryRoutes.js
│   ├── denominationRoutes.js
│   ├── materialRoutes.js
│   └── conditionRoutes.js
├── middleware/               # Промежуточное ПО
│   └── validation.js
├── scripts/                  # Скрипты инициализации
│   ├── init_db.sql           # SQL скрипт для создания таблиц
│   └── migrate.js            # Скрипт миграции
├── .env.example              # Пример файла переменных окружения
└── package.json
```

## Технологии

- Node.js
- Express.js
- PostgreSQL
- pg (PostgreSQL клиент)
- Joi (валидация)
- dotenv (переменные окружения)