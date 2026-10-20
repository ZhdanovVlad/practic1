-- Портал «Конференции.РФ»
-- Схема подсистемы бронирования помещений

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'user'
        CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE,
    room_type VARCHAR(40) NOT NULL
        CHECK (room_type IN ('аудитория', 'коворкинг', 'кинозал')),
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    address VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    room_id INTEGER NOT NULL REFERENCES rooms(id),
    start_date DATE NOT NULL,
    payment_method VARCHAR(40) NOT NULL
        CHECK (payment_method IN ('очное посещение', 'СБП')),
    status VARCHAR(40) NOT NULL DEFAULT 'Новая'
        CHECK (status IN ('Новая', 'Мероприятие назначено', 'Завершено')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    application_id INTEGER NOT NULL UNIQUE REFERENCES applications(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);

COMMENT ON TABLE users IS 'Зарегистрированные пользователи портала и администратор';
COMMENT ON TABLE rooms IS 'Помещения для проведения конференций';
COMMENT ON TABLE applications IS 'Заявки на бронирование помещений';
COMMENT ON TABLE reviews IS 'Отзывы о качестве проведенного мероприятия';
