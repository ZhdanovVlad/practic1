const express = require("express");
const AuthService = require("../services/AuthService");
const { asyncHandler } = require("../http");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
const authService = new AuthService();

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const user = await authService.register(req.body);
    req.session.user = user.toPublic();
    res.status(201).json({ user: user.toPublic() });
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const user = await authService.login(req.body.login, req.body.password);
    req.session.user = user.toPublic();
    res.json({ user: user.toPublic() });
  })
);

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ ok: true });
  });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.session.user });
});

module.exports = router;
