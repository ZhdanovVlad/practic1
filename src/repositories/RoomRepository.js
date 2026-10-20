const pool = require("../db/pool");
const Room = require("../models/Room");

class RoomRepository {
  async findAll() {
    const { rows } = await pool.query("SELECT * FROM rooms ORDER BY name");
    return rows.map((row) => Room.fromRow(row));
  }

  async findByName(name) {
    const { rows } = await pool.query(
      "SELECT * FROM rooms WHERE LOWER(name) = LOWER($1)",
      [name.trim()]
    );
    return Room.fromRow(rows[0]);
  }
}

module.exports = RoomRepository;
