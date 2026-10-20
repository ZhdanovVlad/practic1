const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const pool = require("./pool");
const config = require("../config");

const ROOMS = [
  { name: "Аудитория Пушкин", roomType: "аудитория", capacity: 80, address: "Москва, ул. Академическая, 12" },
  { name: "Аудитория Ломоносов", roomType: "аудитория", capacity: 120, address: "Москва, Ленинский пр-т, 4" },
  { name: "Коворкинг Старт", roomType: "коворкинг", capacity: 40, address: "Москва, ул. Новая, 7" },
  { name: "Коворкинг Идея", roomType: "коворкинг", capacity: 25, address: "Санкт-Петербург, Невский пр-т, 28" },
  { name: "Кинозал Панорама", roomType: "кинозал", capacity: 200, address: "Казань, ул. Баумана, 15" },
  { name: "Кинозал Экран", roomType: "кинозал", capacity: 150, address: "Екатеринбург, ул. Малышева, 36" }
];

async function migrate() {
  const schemaPath = path.join(__dirname, "..", "..", "sql", "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf8");
  await pool.query(schema);

  for (const room of ROOMS) {
    await pool.query(
      `INSERT INTO rooms (name, room_type, capacity, address)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (name) DO NOTHING`,
      [room.name, room.roomType, room.capacity, room.address]
    );
  }

  const passwordHash = await bcrypt.hash(config.admin.password, 10);
  await pool.query(
    `INSERT INTO users (login, password_hash, full_name, phone, email, role)
     VALUES ($1, $2, $3, $4, $5, 'admin')
     ON CONFLICT (login) DO NOTHING`,
    [
      config.admin.login,
      passwordHash,
      config.admin.fullName,
      config.admin.phone,
      config.admin.email
    ]
  );
}

module.exports = { migrate, ROOMS };
