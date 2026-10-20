const bcrypt = require("bcryptjs");
const UserRepository = require("../repositories/UserRepository");
const {
  LOGIN_RE,
  FIO_RE,
  PHONE_RE,
  EMAIL_RE,
  ValidationError,
  requireFields
} = require("../validation");

class AuthService {
  constructor() {
    this.users = new UserRepository();
  }

  async register(payload) {
    requireFields(payload, ["login", "password", "fullName", "phone", "email"]);

    const login = payload.login.trim();
    const password = payload.password;
    const fullName = payload.fullName.trim().replace(/\s+/g, " ");
    const phone = payload.phone.trim();
    const email = payload.email.trim();

    if (!LOGIN_RE.test(login)) {
      throw new ValidationError("Логин: латиница и цифры, не менее 6 символов");
    }
    if (password.length < 8) {
      throw new ValidationError("Пароль должен содержать минимум 8 символов");
    }
    if (!FIO_RE.test(fullName)) {
      throw new ValidationError("ФИО: символы кириллицы и пробелы (имя и фамилия)");
    }
    if (!PHONE_RE.test(phone)) {
      throw new ValidationError("Телефон должен быть в формате 8(XXX)XXX-XX-XX");
    }
    if (!EMAIL_RE.test(email)) {
      throw new ValidationError("Укажите корректный адрес электронной почты");
    }

    if (await this.users.findByLogin(login)) {
      throw new ValidationError("Пользователь с таким логином уже существует");
    }
    if (await this.users.findByEmail(email)) {
      throw new ValidationError("Пользователь с такой почтой уже существует");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    return this.users.create({ login, passwordHash, fullName, phone, email });
  }

  async login(login, password) {
    if (!login || !password) {
      throw new ValidationError("Введите логин и пароль");
    }
    const user = await this.users.findByLogin(String(login).trim());
    if (!user) {
      throw new ValidationError("Неверный логин или пароль");
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new ValidationError("Неверный логин или пароль");
    }
    return user;
  }
}

module.exports = AuthService;
