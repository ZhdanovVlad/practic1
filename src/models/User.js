class User {
  constructor({ id, login, passwordHash, fullName, phone, email, role, createdAt }) {
    this.id = id;
    this.login = login;
    this.passwordHash = passwordHash;
    this.fullName = fullName;
    this.phone = phone;
    this.email = email;
    this.role = role;
    this.createdAt = createdAt;
  }

  static fromRow(row) {
    if (!row) {
      return null;
    }
    return new User({
      id: row.id,
      login: row.login,
      passwordHash: row.password_hash,
      fullName: row.full_name,
      phone: row.phone,
      email: row.email,
      role: row.role,
      createdAt: row.created_at
    });
  }

  toPublic() {
    return {
      id: this.id,
      login: this.login,
      fullName: this.fullName,
      phone: this.phone,
      email: this.email,
      role: this.role
    };
  }
}

module.exports = User;
