async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    credentials: "same-origin",
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Ошибка запроса");
  }
  return data;
}

async function currentUser() {
  try {
    const data = await api("/api/auth/me");
    return data.user;
  } catch {
    return null;
  }
}

function showMessage(el, text, type) {
  el.textContent = text || "";
  el.className = `msg ${type || ""}`;
}

function statusClass(status) {
  if (status === "Новая") return "new";
  if (status === "Мероприятие назначено") return "scheduled";
  return "done";
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("ru-RU");
}

function renderNav(user, active) {
  const nav = document.querySelector("nav");
  if (!nav) return;
  if (!user) {
    nav.innerHTML = `
      <a href="/login.html" class="${active === "login" ? "active" : ""}">Вход</a>
      <a href="/register.html" class="${active === "register" ? "active" : ""}">Регистрация</a>
    `;
    return;
  }
  if (user.role === "admin") {
    nav.innerHTML = `
      <a href="/admin.html" class="${active === "admin" ? "active" : ""}">Панель администратора</a>
      <button class="linkish" id="logoutBtn" type="button">Выход</button>
    `;
  } else {
    nav.innerHTML = `
      <a href="/applications.html" class="${active === "apps" ? "active" : ""}">Мои заявки</a>
      <a href="/new-application.html" class="${active === "new" ? "active" : ""}">Новая заявка</a>
      <button class="linkish" id="logoutBtn" type="button">Выход</button>
    `;
  }
  document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    await api("/api/auth/logout", { method: "POST", body: {} });
    location.href = "/login.html";
  });
}

function requireGuest(user) {
  if (!user) return;
  location.href = user.role === "admin" ? "/admin.html" : "/applications.html";
}

function requireRole(user, role) {
  if (!user) {
    location.href = "/login.html";
    return false;
  }
  if (role && user.role !== role) {
    location.href = user.role === "admin" ? "/admin.html" : "/applications.html";
    return false;
  }
  return true;
}

function maskPhone(input) {
  input.addEventListener("input", () => {
    let digits = input.value.replace(/\D/g, "");
    if (!digits.startsWith("8")) {
      digits = `8${digits}`;
    }
    digits = digits.slice(0, 11);
    const rest = digits.slice(1);
    let formatted = "8";
    if (rest.length) formatted += `(${rest.slice(0, 3)}`;
    if (rest.length >= 3) formatted += `)${rest.slice(3, 6)}`;
    if (rest.length >= 6) formatted += `-${rest.slice(6, 8)}`;
    if (rest.length >= 8) formatted += `-${rest.slice(8, 10)}`;
    input.value = formatted;
  });
}
