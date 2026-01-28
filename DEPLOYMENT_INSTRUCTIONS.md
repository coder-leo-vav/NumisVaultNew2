# Инструкция по развёртыванию приложения NumisVault

## Обзор
NumisVault - это веб-приложение для коллекционирования монет, состоящее из:
1. Frontend: React/Vite приложение
2. Backend: Node.js/Express API с PostgreSQL

## Локальный запуск

### Подготовка

1. Убедитесь, что у вас установлены:
   - Node.js (v16 или выше)
   - npm или yarn
   - PostgreSQL (или Docker для контейнеризации)

### Запуск backend части

1. Перейдите в директорию backend:
```bash
cd /workspace/backend
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл переменных окружения:
```bash
cp .env.example .env
```

4. Настройте параметры подключения к базе данных в файле `.env`:
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=numisvault
DB_PASSWORD=postgres
DB_PORT=5432
```

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

Backend будет доступен по адресу `http://localhost:5000`

### Запуск frontend части

1. Вернитесь в корневую директорию проекта:
```bash
cd /workspace
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите frontend:
```bash
npm run dev
```

Frontend будет доступен по адресу `http://localhost:3000`

## Структура API

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
- `GET /api/users` - получить список пользователей
- `GET /api/users/:id` - получить конкретного пользователя
- `POST /api/users/register` - зарегистрировать нового пользователя
- `POST /api/users/login` - авторизоваться
- `PUT /api/users/:id` - обновить профиль пользователя
- `DELETE /api/users/:id` - удалить пользователя

## Конфигурация для продакшена

Для запуска в продакшене рекомендуется:

1. Использовать nginx как reverse proxy
2. Настроить SSL сертификаты
3. Настроить безопасность (CORS, Helmet и т.д.)
4. Использовать более надежные пароли для базы данных
5. Настроить логирование и мониторинг

## Docker Compose для всего приложения

Для быстрого запуска всего приложения можно использовать следующий docker-compose.yml:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:13
    container_name: numisvault_postgres
    environment:
      POSTGRES_DB: numisvault
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: numisvault_backend
    ports:
      - "5000:5000"
    environment:
      DB_HOST: postgres
      DB_NAME: numisvault
      DB_USER: postgres
      DB_PASSWORD: postgres
    depends_on:
      - postgres
    restart: unless-stopped

  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: numisvault_frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
```

Создайте соответствующие Dockerfile для каждой части приложения перед использованием.