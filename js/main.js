const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const menu = $(".nav");
const toggle = $(".menu-toggle");
if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) menu.classList.remove("open");
  });
}

const lang = $(".lang");
if (lang) {
  const btn = $(".lang-btn", lang);
  btn.addEventListener("click", () => {
    const open = lang.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", (event) => {
    if (!lang.contains(event.target)) lang.classList.remove("open");
  });
}

$$(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const id = tab.dataset.panel;
    $$(".tab").forEach((item) => item.setAttribute("aria-selected", String(item === tab)));
    $$(".panel").forEach((panel) => panel.classList.toggle("active", panel.id === id));
  });
});

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.hidden = false;
  const focusable = modal.querySelector("input, button, textarea");
  if (focusable) focusable.focus();
}
function closeModal(modal) {
  modal.hidden = true;
}

$$("[data-open]").forEach((button) => {
  button.addEventListener("click", () => openModal(button.dataset.open));
});
$$(".modal").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target.closest("[data-close]")) closeModal(modal);
  });
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") $$(".modal").forEach((modal) => { if (!modal.hidden) closeModal(modal); });
});

$$("form[data-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const note = $(".form-note", form);
    if (!form.checkValidity()) {
      note.textContent = "Oups ! Quelque chose s'est mal passé. Veuillez vérifier vos informations et soumettre à nouveau le formulaire.";
      note.className = "form-note bad";
      form.reportValidity();
      return;
    }
    note.textContent = "Merci de nous avoir contactés. Votre formulaire a été soumis avec succès.";
    note.className = "form-note ok";
    form.reset();
  });
});

const consentKey = "ntr-consent";
const cookie = $("#cookie");
const prefs = $("#cookie-prefs");
if (cookie && !localStorage.getItem(consentKey)) cookie.hidden = false;
$("#cookie-accept")?.addEventListener("click", () => {
  localStorage.setItem(consentKey, "accepted");
  cookie.hidden = true;
});
$$("[data-consent='refuse']").forEach((button) => {
  button.addEventListener("click", () => {
    localStorage.setItem(consentKey, "refused");
    cookie.hidden = true;
  });
});
$("#cookie-save")?.addEventListener("click", () => {
  const stats = $("#consent-stats")?.checked ? "1" : "0";
  const marketing = $("#consent-marketing")?.checked ? "1" : "0";
  localStorage.setItem(consentKey, `custom:${stats}${marketing}`);
  cookie.hidden = true;
});
$("#cookie-more")?.addEventListener("click", () => prefs?.classList.toggle("open"));
$(".consent-reopen")?.addEventListener("click", () => { if (cookie) cookie.hidden = false; });

const toTop = $(".to-top");
if (toTop) {
  window.addEventListener("scroll", () => {
    toTop.style.display = window.scrollY > 700 ? "block" : "none";
  });
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

const mapEl = document.getElementById("map");
if (mapEl && window.L) {
  const map = L.map(mapEl, { scrollWheelZoom: true }).setView([43.7102, 7.262], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19
  }).addTo(map);
  const icon = L.divIcon({
    className: "ntr-pin",
    html: '<span style="display:block;width:18px;height:18px;background:#0056e2;border:2px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 4px rgba(0,0,0,.3)"></span>',
    iconSize: [18, 18],
    iconAnchor: [9, 18]
  });
  fetch("data/chantiers.json")
    .then((response) => response.json())
    .then((markers) => {
      markers.forEach((marker) => {
        L.marker([marker.lat, marker.lng], { icon }).addTo(map).bindPopup(marker.title);
      });
    })
    .catch(() => {});
}

const player = document.querySelector("[data-player]");
if (player) {
  const video = player.querySelector("video");
  const play = player.querySelector("[data-play]");
  const start = () => {
      if (!video.getAttribute("src")) video.src = "images/video/chantier.mp4";
      video.muted = true;
      video.controls = true;
    player.classList.add("is-playing");
    if (play) play.hidden = true;
    video.play().catch(() => {
      player.classList.remove("is-playing");
      if (play) play.hidden = false;
    });
  };
  play?.addEventListener("click", start);
}

const defect = document.querySelector("[data-defect]");
defect?.addEventListener("click", () => {
  const quote = document.getElementById("le-prix");
  const open = defect.getAttribute("aria-expanded") === "true";
  defect.setAttribute("aria-expanded", String(!open));
  quote?.classList.toggle("is-lit", !open);
  if (!open) quote?.scrollIntoView({ behavior: "smooth", block: "center" });
});
