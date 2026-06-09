// ===== Fas Plast — site logic =====
const WA_NUMBER = "38344885649";
const EMAIL = "fasplast@hotmail.com";

// ----- i18n -----
let lang = localStorage.getItem("fp_lang") || "sq";

function t(key) {
  return (I18N[lang] && I18N[lang][key]) || I18N.sq[key] || key;
}

function applyLang(newLang) {
  lang = newLang;
  localStorage.setItem("fp_lang", lang);
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPh);
  });
  document.querySelectorAll("#langSwitch button").forEach((b) => {
    b.classList.toggle("active", b.dataset.lang === lang);
  });
  document.querySelectorAll(".g-item .ph span").forEach((el) => {
    el.textContent = t("gallery.ph");
  });
}

document.querySelectorAll("#langSwitch button").forEach((btn) => {
  btn.addEventListener("click", () => applyLang(btn.dataset.lang));
});

// ----- Mobile nav -----
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => navLinks.classList.remove("open"))
);

// ----- Gallery (project-1.jpg ... project-8.jpg, placeholder if missing) -----
const galleryGrid = document.getElementById("galleryGrid");
for (let i = 1; i <= 8; i++) {
  const item = document.createElement("div");
  item.className = "g-item";
  item.innerHTML = `
    <div class="ph">
      <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/></svg>
      <span>${t("gallery.ph")}</span>
    </div>
    <img src="img/gallery/project-${i}.jpg" alt="Fas Plast project ${i}" loading="lazy" onerror="this.remove()" />
  `;
  galleryGrid.appendChild(item);
}

// ----- Quote form -----
function buildMessage() {
  const name = document.getElementById("qName").value.trim();
  const phone = document.getElementById("qPhone").value.trim();
  const product = document.getElementById("qProduct").value;
  const msg = document.getElementById("qMsg").value.trim();
  return (
    `${t("form.waIntro")}\n` +
    `${t("form.waName")}: ${name}\n` +
    `${t("form.waPhone")}: ${phone}\n` +
    `${t("form.waProduct")}: ${product}` +
    (msg ? `\n${t("form.waMsg")}: ${msg}` : "")
  );
}

document.getElementById("quoteForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const text = encodeURIComponent(buildMessage());
  window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, "_blank");
});

document.getElementById("sendEmail").addEventListener("click", () => {
  const form = document.getElementById("quoteForm");
  if (!form.reportValidity()) return;
  const subject = encodeURIComponent(t("form.emailSubject"));
  const body = encodeURIComponent(buildMessage());
  window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
});

// ----- Footer year -----
document.getElementById("year").textContent = new Date().getFullYear();

// ----- Init -----
applyLang(lang);
