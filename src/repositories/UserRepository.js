const pool = require("../db/pool");
const User = require("../models/User");

class UserRepository {
  async findByLogin(login) {
    const { rows } = await pool.query("SELECT * FROM users WHERE login = $1", [login]);
    return User.fromRow(rows[0]);
  }

  async findByEmail(email) {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return User.fromRow(rows[0]);
  }

  async findById(id) {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return User.fromRow(rows[0]);
  }

  async create({ login, passwordHash, fullName, phone, email }) {
    const { rows } = await pool.query(
      `INSERT INTO users (login, password_hash, full_name, phone, email, role)
       VALUES ($1, $2, $3, $4, $5, 'user')
       RETURNING *`,
      [login, passwordHash, fullName, phone, email]
    );
    return User.fromRow(rows[0]);
  }
}

module.exports = UserRepository;
