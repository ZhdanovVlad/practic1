const pool = require("../db/pool");
const Review = require("../models/Review");

class ReviewRepository {
  async create({ applicationId, userId, rating, comment }) {
    const { rows } = await pool.query(
      `INSERT INTO reviews (application_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [applicationId, userId, rating, comment]
    );
    return Review.fromRow(rows[0]);
  }
}

module.exports = ReviewRepository;
