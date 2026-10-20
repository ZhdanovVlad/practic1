require("dotenv").config();

module.exports = {
  port: Number(process.env.PORT) || 3000,
  sessionSecret: process.env.SESSION_SECRET || "dev-secret",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5433,
    database: process.env.DB_NAME || "conferencerf",
    user: process.env.DB_USER || "conferencerf",
    password: process.env.DB_PASSWORD || "conferencerf"
  },
  admin: {
    login: "Conf2027",
    password: "Demo77",
    fullName: "Администратор портала",
    phone: "8(800)555-35-35",
    email: "admin@conferencii.rf"
  }
};
