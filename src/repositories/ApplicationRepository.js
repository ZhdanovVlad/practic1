const pool = require("../db/pool");
const Application = require("../models/Application");

const SELECT = `
  SELECT
    a.*,
    u.login AS user_login,
    u.full_name AS user_full_name,
    r.name AS room_name,
    r.room_type AS room_type,
    rv.id AS review_id,
    rv.rating AS review_rating,
    rv.comment AS review_comment
  FROM applications a
  JOIN users u ON u.id = a.user_id
  JOIN rooms r ON r.id = a.room_id
  LEFT JOIN reviews rv ON rv.application_id = a.id
`;

class ApplicationRepository {
  async findByUser(userId) {
    const { rows } = await pool.query(
      `${SELECT} WHERE a.user_id = $1 ORDER BY a.created_at DESC`,
      [userId]
    );
    return rows.map((row) => Application.fromRow(row));
  }

  async findAll() {
    const { rows } = await pool.query(`${SELECT} ORDER BY a.created_at DESC`);
    return rows.map((row) => Application.fromRow(row));
  }

  async findById(id) {
    const { rows } = await pool.query(`${SELECT} WHERE a.id = $1`, [id]);
    return Application.fromRow(rows[0]);
  }

  async create({ userId, roomId, startDate, paymentMethod }) {
    const { rows } = await pool.query(
      `INSERT INTO applications (user_id, room_id, start_date, payment_method, status)
       VALUES ($1, $2, $3, $4, 'Новая')
       RETURNING id`,
      [userId, roomId, startDate, paymentMethod]
    );
    return this.findById(rows[0].id);
  }

  async updateStatus(id, status) {
    await pool.query("UPDATE applications SET status = $1 WHERE id = $2", [status, id]);
    return this.findById(id);
  }
}

module.exports = ApplicationRepository;
