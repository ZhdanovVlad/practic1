const ApplicationRepository = require("../repositories/ApplicationRepository");
const RoomRepository = require("../repositories/RoomRepository");
const ReviewRepository = require("../repositories/ReviewRepository");
const { ValidationError, requireFields, parseConferenceDate } = require("../validation");

const PAYMENT = {
  visit: "очное посещение",
  sbp: "СБП"
};

const STATUSES = ["Новая", "Мероприятие назначено", "Завершено"];

class BookingService {
  constructor() {
    this.applications = new ApplicationRepository();
    this.rooms = new RoomRepository();
    this.reviews = new ReviewRepository();
  }

  listRooms() {
    return this.rooms.findAll();
  }

  listForUser(userId) {
    return this.applications.findByUser(userId);
  }

  listAll() {
    return this.applications.findAll();
  }

  async create(userId, payload) {
    requireFields(payload, ["roomName", "startDate", "paymentMethod"]);

    const room = await this.rooms.findByName(payload.roomName);
    if (!room) {
      throw new ValidationError("Помещение с таким названием не найдено");
    }

    const startDate = parseConferenceDate(payload.startDate);
    const paymentMethod = PAYMENT[payload.paymentMethod] || payload.paymentMethod;
    if (!Object.values(PAYMENT).includes(paymentMethod)) {
      throw new ValidationError("Выберите способ оплаты: очное посещение или СБП");
    }

    return this.applications.create({
      userId,
      roomId: room.id,
      startDate,
      paymentMethod
    });
  }

  async addReview(userId, applicationId, payload) {
    requireFields(payload, ["rating", "comment"]);
    const application = await this.applications.findById(applicationId);
    if (!application || application.userId !== userId) {
      throw new ValidationError("Заявка не найдена");
    }
    if (application.status !== "Завершено") {
      throw new ValidationError("Отзыв можно оставить только после завершения мероприятия");
    }
    if (application.review) {
      throw new ValidationError("Отзыв по этой заявке уже оставлен");
    }

    const rating = Number(payload.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new ValidationError("Оценка должна быть от 1 до 5");
    }
    const comment = String(payload.comment).trim();
    if (comment.length < 5) {
      throw new ValidationError("Отзыв должен содержать не менее 5 символов");
    }

    return this.reviews.create({ applicationId, userId, rating, comment });
  }

  async changeStatus(id, status) {
    if (!STATUSES.includes(status)) {
      throw new ValidationError("Недопустимый статус заявки");
    }
    const application = await this.applications.findById(id);
    if (!application) {
      throw new ValidationError("Заявка не найдена");
    }
    return this.applications.updateStatus(id, status);
  }
}

module.exports = BookingService;
