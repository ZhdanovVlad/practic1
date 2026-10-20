class Application {
  constructor({
    id,
    userId,
    roomId,
    startDate,
    paymentMethod,
    status,
    createdAt,
    userLogin,
    userFullName,
    roomName,
    roomType,
    review
  }) {
    this.id = id;
    this.userId = userId;
    this.roomId = roomId;
    this.startDate = startDate;
    this.paymentMethod = paymentMethod;
    this.status = status;
    this.createdAt = createdAt;
    this.userLogin = userLogin;
    this.userFullName = userFullName;
    this.roomName = roomName;
    this.roomType = roomType;
    this.review = review;
  }

  static fromRow(row) {
    if (!row) {
      return null;
    }
    return new Application({
      id: row.id,
      userId: row.user_id,
      roomId: row.room_id,
      startDate: row.start_date,
      paymentMethod: row.payment_method,
      status: row.status,
      createdAt: row.created_at,
      userLogin: row.user_login,
      userFullName: row.user_full_name,
      roomName: row.room_name,
      roomType: row.room_type,
      review: row.review_id
        ? {
            id: row.review_id,
            rating: row.review_rating,
            comment: row.review_comment
          }
        : null
    });
  }

  toPublic() {
    return {
      id: this.id,
      userId: this.userId,
      roomId: this.roomId,
      startDate: this.startDate,
      paymentMethod: this.paymentMethod,
      status: this.status,
      createdAt: this.createdAt,
      userLogin: this.userLogin,
      userFullName: this.userFullName,
      roomName: this.roomName,
      roomType: this.roomType,
      review: this.review
    };
  }
}

module.exports = Application;
