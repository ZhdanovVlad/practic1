const express = require("express");
const BookingService = require("../services/BookingService");
const { asyncHandler } = require("../http");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();
const booking = new BookingService();

router.get(
  "/rooms",
  requireAuth,
  asyncHandler(async (req, res) => {
    const rooms = await booking.listRooms();
    res.json({ rooms: rooms.map((room) => room.toPublic()) });
  })
);

router.get(
  "/applications",
  requireAuth,
  asyncHandler(async (req, res) => {
    if (req.session.user.role === "admin") {
      return res.status(403).json({ error: "Администратор работает в панели заявок" });
    }
    const applications = await booking.listForUser(req.session.user.id);
    res.json({ applications: applications.map((item) => item.toPublic()) });
  })
);

router.post(
  "/applications",
  requireAuth,
  asyncHandler(async (req, res) => {
    if (req.session.user.role === "admin") {
      return res.status(403).json({ error: "Администратор не создает заявки" });
    }
    const application = await booking.create(req.session.user.id, req.body);
    res.status(201).json({ application: application.toPublic() });
  })
);

router.post(
  "/applications/:id/review",
  requireAuth,
  asyncHandler(async (req, res) => {
    const review = await booking.addReview(
      req.session.user.id,
      Number(req.params.id),
      req.body
    );
    res.status(201).json({ review: review.toPublic() });
  })
);

router.get(
  "/admin/applications",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const applications = await booking.listAll();
    res.json({ applications: applications.map((item) => item.toPublic()) });
  })
);

router.patch(
  "/admin/applications/:id/status",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const application = await booking.changeStatus(Number(req.params.id), req.body.status);
    res.json({ application: application.toPublic() });
  })
);

module.exports = router;
