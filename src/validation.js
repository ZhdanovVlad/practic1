const LOGIN_RE = /^[A-Za-z0-9]{6,}$/;
const FIO_RE = /^[А-ЯЁа-яё]+(?:[ ]+[А-ЯЁа-яё]+)+$/;
const PHONE_RE = /^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_DOTS_RE = /^(\d{2})\.(\d{2})\.(\d{4})$/;
const DATE_ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
  }
}

function requireFields(payload, fields) {
  for (const field of fields) {
    if (payload[field] === undefined || payload[field] === null || String(payload[field]).trim() === "") {
      throw new ValidationError("Все поля обязательны для заполнения");
    }
  }
}

function parseConferenceDate(value) {
  const raw = String(value).trim();
  let year;
  let month;
  let day;

  let match = raw.match(DATE_DOTS_RE);
  if (match) {
    day = Number(match[1]);
    month = Number(match[2]);
    year = Number(match[3]);
  } else {
    match = raw.match(DATE_ISO_RE);
    if (!match) {
      throw new ValidationError("Дата должна быть в формате ДД.ММ.ГГГГ");
    }
    year = Number(match[1]);
    month = Number(match[2]);
    day = Number(match[3]);
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new ValidationError("Указана некорректная дата");
  }
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

module.exports = {
  LOGIN_RE,
  FIO_RE,
  PHONE_RE,
  EMAIL_RE,
  ValidationError,
  requireFields,
  parseConferenceDate
};
