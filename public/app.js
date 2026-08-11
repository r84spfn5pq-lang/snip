const TOKEN_KEY = "snip_token";

const authSection = document.getElementById("auth-section");
const appSection = document.getElementById("app-section");
const logoutBtn = document.getElementById("logout-btn");
const authError = document.getElementById("auth-error");

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const authTabs = document.querySelectorAll(".auth-tab");

const form = document.getElementById("create-form");
const urlInput = document.getElementById("url-input");
const formError = document.getElementById("form-error");
const rack = document.getElementById("ticket-rack");
const emptyState = document.getElementById("empty-state");

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function showApp() {
  authSection.hidden = true;
  appSection.hidden = false;
  logoutBtn.hidden = false;
  loadLinks();
}

function showAuth() {
  authSection.hidden = false;
  appSection.hidden = true;
  logoutBtn.hidden = true;
}

authTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    authTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    const isLogin = tab.dataset.tab === "login";
    loginForm.hidden = !isLogin;
    signupForm.hidden = isLogin;
    authError.hidden = true;
  });
});

async function handleAuthSubmit(e, endpoint) {
  e.preventDefault();
  authError.hidden = true;

  const formData = new FormData(e.target);
  const body = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const res = await fetch(`/api/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    authError.textContent = data.error || "Something went wrong.";
    authError.hidden = false;
    return;
  }

  setToken(data.token);
  e.target.reset();
  showApp();
}

loginForm.addEventListener("submit", (e) => handleAuthSubmit(e, "login"));
signupForm.addEventListener("submit", (e) => handleAuthSubmit(e, "signup"));

logoutBtn.addEventListener("click", () => {
  clearToken();
  showAuth();
});

function renderTicket(link) {
  const ticket = document.createElement("div");
  ticket.className = "ticket";
  ticket.dataset.code = link.code;

  const shortUrl = `${window.location.origin}/${link.code}`;

  ticket.innerHTML = `
    <div class="ticket-main">
      <a class="ticket-code code" href="/${link.code}" target="_blank" rel="noopener">/${link.code}</a>
      <p class="ticket-url" title="${link.url}">${link.url}</p>
    </div>
    <div class="ticket-stats">
      <button class="copy-btn" type="button">Copy</button>
      <div>
        <span class="ticket-clicks">${link.clicks}</span>
        <span class="ticket-clicks-label">clicks</span>
      </div>
    </div>
  `;

  ticket.querySelector(".copy-btn").addEventListener("click", () => {
    navigator.clipboard.writeText(shortUrl);
    const btn = ticket.querySelector(".copy-btn");
    const original = btn.textContent;
    btn.textContent = "Copied";
    setTimeout(() => { btn.textContent = original; }, 1200);
  });

  return ticket;
}

async function loadLinks() {
  const res = await fetch("/api/links", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  if (res.status === 401) {
    clearToken();
    showAuth();
    return;
  }

  const links = await res.json();

  rack.querySelectorAll(".ticket").forEach((el) => el.remove());
  emptyState.hidden = links.length > 0;

  links.forEach((link) => {
    rack.appendChild(renderTicket(link));
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  formError.hidden = true;

  const res = await fetch("/api/links", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ url: urlInput.value }),
  });

  if (!res.ok) {
    const body = await res.json();
    formError.textContent = body.error || "Something went wrong.";
    formError.hidden = false;
    return;
  }

  urlInput.value = "";
  await loadLinks();
});

const socket = io();

socket.on("linkClicked", ({ code, clicks }) => {
  const ticket = rack.querySelector(`.ticket[data-code="${code}"]`);
  if (!ticket) return;

  const clicksEl = ticket.querySelector(".ticket-clicks");
  clicksEl.textContent = clicks;
  clicksEl.classList.add("pulse");
  setTimeout(() => clicksEl.classList.remove("pulse"), 400);
});

if (getToken()) {
  showApp();
} else {
  showAuth();
}
