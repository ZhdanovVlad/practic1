# Портал «Конференции.РФ»

Информационная система бронирования помещений для Всероссийских конференций.

Стек: HTML/CSS/JavaScript, Node.js (Express), PostgreSQL, ООП.

## Запуск

1. Установите [Docker Desktop](https://www.docker.com/products/docker-desktop/) и Node.js 18+.
2. Скопируйте `.env.example` в `.env`.
3. Поднимите базу и сервер:

```bash
docker compose up -d
npm install
npm start
```

Приложение: http://localhost:3000

Администратор: логин `Conf2027`, пароль `Demo77`.

ER-диаграмма: `docs/er-diagram.svg` и интерактивная версия `docs/er-diagram.html`.
