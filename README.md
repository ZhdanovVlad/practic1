# Портал «Конференции.РФ»

Информационная система бронирования помещений для Всероссийских конференций.

Стек: HTML/CSS/JavaScript, Node.js (Express), PostgreSQL, ООП.

## Запуск

1. Установите Node.js 18+ и PostgreSQL 18 (или Docker Desktop).
2. Скопируйте `.env.example` в `.env`.
3. Поднимите базу и сервер:

```bash
npm run db:local
npm install
npm start
```

Альтернатива через Docker: `docker compose up -d`.

Приложение: http://localhost:3000

Администратор: логин `Conf2027`, пароль `Demo77`.

ER-диаграмма: `docs/er-diagram.svg` и интерактивная версия `docs/er-diagram.html`.
