const path = require("path");
const express = require("express");
const session = require("express-session");
const config = require("./src/config");
const { migrate } = require("./src/db/migrate");
const authRoutes = require("./src/routes/auth");
const bookingRoutes = require("./src/routes/booking");
const { errorHandler } = require("./src/http");

const app = express();

app.use(express.json());
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 8 }
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use("/docs", express.static(path.join(__dirname, "docs")));
app.use("/api/auth", authRoutes);
app.use("/api", bookingRoutes);
app.use(errorHandler);

async function start() {
  await migrate();
  app.listen(config.port, () => {
    console.log(`Конференции.РФ: http://localhost:${config.port}`);
  });
}

start().catch((error) => {
  console.error("Не удалось запустить сервер:", error.message);
  process.exit(1);
});
