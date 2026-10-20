const { ValidationError } = require("./validation");

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  if (err.code === "23505") {
    return res.status(400).json({ error: "Запись с такими уникальными данными уже существует" });
  }
  const status = err.status || (err instanceof ValidationError ? 400 : 500);
  const message = status === 500 ? "Внутренняя ошибка сервера" : err.message;
  if (status === 500) {
    console.error(err);
  }
  res.status(status).json({ error: message });
}

module.exports = { asyncHandler, errorHandler };
