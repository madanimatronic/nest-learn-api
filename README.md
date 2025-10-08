# Nest learn API

## Описание

Данный пет-проект нацелен преимущественно на изучение фреймворка NestJS и предлагаемой им архитектуры для построения backend приложений.<br>
По этой причине в проекте встречается масса упрощений и нереализованного функционала (тесты также не реализованы). К тому же некоторые фичи не было смысла делать повторно, потому что они уже есть в [другом моём проекте](https://github.com/madanimatronic/simple-express-api-pg/tree/main)<br>

**Features:**

- Система авторизации с access и refresh токенами (passport.js)
- Роли пользователей
- Валидация данных

**Также сделано:**

- Документирование API при помощи swagger (частичное)
- Описаны модели данных из БД при помощи sequelize
- Настроен docker и docker-compose для запуска приложения в dev режиме

## Начало работы

1. Создать и настроить файлы `.env`, `.development.env`, `.production.env` и `.docker.development.env` в корне проекта по шаблону `.env.example`

   **Важно:** в `.docker.development.env` нужно указать `POSTGRES_HOST=postgres` вместо `localhost`<br>
   Примечание: `.env` используется как fallback для `.development.env`

2. `npm install`
3. `npm run start:dev`

## Docker

Запуск приложения через docker (требуется Docker Desktop или другая среда выполнения docker-контейнеров):

1. `docker-compose build`
2. `docker-compose up`

Команды для управления приложением в docker:

- `docker-compose build` - собрать все образы в стеке (достаточно сделать 1 раз и пересобирать при изменении docker-конфигов)
- `docker-compose up` - поднять контейнеры приложения
- `docker-compose stop` - остановить контейнеры приложения
