class Review {
  constructor({ id, applicationId, userId, rating, comment, createdAt }) {
    this.id = id;
    this.applicationId = applicationId;
    this.userId = userId;
    this.rating = rating;
    this.comment = comment;
    this.createdAt = createdAt;
  }

  static fromRow(row) {
    if (!row) {
      return null;
    }
    return new Review({
      id: row.id,
      applicationId: row.application_id,
      userId: row.user_id,
      rating: row.rating,
      comment: row.comment,
      createdAt: row.created_at
    });
  }

  toPublic() {
    return {
      id: this.id,
      applicationId: this.applicationId,
      rating: this.rating,
      comment: this.comment,
      createdAt: this.createdAt
    };
  }
}

module.exports = Review;
