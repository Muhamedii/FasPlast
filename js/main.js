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
  document.querySelectorAll(".g-overlay span").forEach((el, i) => {
    if (GALLERY_PHOTOS[i]) el.textContent = GALLERY_PHOTOS[i].caps[newLang] || GALLERY_PHOTOS[i].caps.sq;
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

// ----- Gallery -----
const GALLERY_VIDEOS = [
  { src: "img/gallery/video-1.mp4", label: { sq: "▶ Video", de: "▶ Video", en: "▶ Video" } },
  { src: "img/gallery/video-2.mp4", label: { sq: "▶ Video", de: "▶ Video", en: "▶ Video" } },
  { src: "img/gallery/video-3.mp4", label: { sq: "▶ Video", de: "▶ Video", en: "▶ Video" } },
];

const GALLERY_PHOTOS = [
  { src: "img/gallery/glass-wall-de-1.png", badge: "🇩🇪 Gjermani", caps: { sq: "Mure xhami — Gjermani", de: "Glaswand — Deutschland", en: "Glass wall — Germany" } },
  { src: "img/gallery/house-xk-facade.png", badge: "🇽🇰 Kosovë",   caps: { sq: "Shtëpi individuale — Kosovë", de: "Einfamilienhaus — Kosovo", en: "Residential house — Kosovo" } },
  { src: "img/gallery/glass-wall-de-2.png", badge: "🇩🇪 Gjermani", caps: { sq: "Sisteme xhami — Gjermani", de: "Glassystem — Deutschland", en: "Glass system — Germany" } },
  { src: "img/gallery/door-anthracite.png", badge: null,            caps: { sq: "Derë hyrëse antracit", de: "Haustür Anthrazit", en: "Anthracite entry door" } },
  { src: "img/gallery/commercial-xk.png",  badge: "🇽🇰 Kosovë",   caps: { sq: "Objekt komercial — Kosovë", de: "Gewerbe — Kosovo", en: "Commercial building — Kosovo" } },
  { src: "img/gallery/house-xk-detail.png",badge: "🇽🇰 Kosovë",   caps: { sq: "Dritare & roleta — Kosovë", de: "Fenster & Rollläden — Kosovo", en: "Windows & shutters — Kosovo" } },
  { src: "img/gallery/export-canada.png",  badge: "🇨🇦 Kanada",    caps: { sq: "Eksport drejt Kanadasë", de: "Export nach Kanada", en: "Export to Canada" } },
  { src: "img/gallery/house-de-after.png", badge: "🇩🇪 Gjermani", caps: { sq: "Pas: dritare të reja — Gjermani", de: "Nachher: neue Fenster", en: "After: new windows — Germany" } },
  { src: "img/gallery/gable-window-de.png",badge: "🇩🇪 Gjermani", caps: { sq: "Dritare me porosi — Gjermani", de: "Sonderfenster — Deutschland", en: "Custom window — Germany" } },
  { src: "img/gallery/export-loading.png", badge: null,            caps: { sq: "Ngarkesë për eksport", de: "Export-Verladung", en: "Loading for export" } },
  { src: "img/gallery/house-de-before.png",badge: "🇩🇪 Gjermani", caps: { sq: "Para: zëvendësim dritaresh", de: "Vorher: Fenstererneuerung", en: "Before: window replacement" } },
  { src: "img/gallery/house-de-mid.png",   badge: "🇩🇪 Gjermani", caps: { sq: "Gjatë montimit", de: "Montage läuft", en: "Installation in progress" } },
];

const LB_ITEMS = [
  ...GALLERY_VIDEOS.map((v) => ({ type: "video", src: v.src })),
  ...GALLERY_PHOTOS.map((p) => ({ type: "img", src: p.src, caps: p.caps })),
];
let lbIndex = 0;

// Render video strip
const galleryVideos = document.getElementById("galleryVideos");
GALLERY_VIDEOS.forEach((v, i) => {
  const item = document.createElement("div");
  item.className = "g-video";
  item.innerHTML = `
    <video src="${v.src}" muted autoplay loop playsinline preload="metadata"></video>
    <div class="play-btn">
      <svg viewBox="0 0 24 24" width="56" height="56"><circle cx="12" cy="12" r="11" fill="rgba(0,0,0,.45)"/><path d="M10 8l6 4-6 4V8z" fill="#fff"/></svg>
    </div>
    <span class="g-video-label">${v.label[lang] || v.label.sq}</span>
  `;
  item.addEventListener("click", () => openLightbox(i));
  galleryVideos.appendChild(item);
});

// Render photo grid
const galleryGrid = document.getElementById("galleryGrid");
GALLERY_PHOTOS.forEach((p, i) => {
  const item = document.createElement("div");
  item.className = "g-item";
  item.innerHTML = `
    ${p.badge ? `<span class="g-badge">${p.badge}</span>` : ""}
    <div class="g-overlay"><span>${p.caps[lang] || p.caps.sq}</span></div>
    <img src="${p.src}" alt="${p.caps.en}" loading="lazy" />
  `;
  item.addEventListener("click", () => openLightbox(GALLERY_VIDEOS.length + i));
  galleryGrid.appendChild(item);
});

// Lightbox
function openLightbox(index) {
  lbIndex = index;
  renderLightbox();
  document.getElementById("lbOverlay").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const overlay = document.getElementById("lbOverlay");
  overlay.classList.remove("active");
  const vid = overlay.querySelector("video");
  if (vid) { vid.pause(); vid.src = ""; }
  document.getElementById("lbContent").innerHTML = "";
  document.body.style.overflow = "";
}

function renderLightbox() {
  const content = document.getElementById("lbContent");
  const caption = document.getElementById("lbCaption");
  const item = LB_ITEMS[lbIndex];
  const oldVid = content.querySelector("video");
  if (oldVid) { oldVid.pause(); oldVid.src = ""; }
  if (item.type === "video") {
    content.innerHTML = `<video src="${item.src}" controls autoplay playsinline></video>`;
    caption.textContent = "";
  } else {
    content.innerHTML = `<img src="${item.src}" alt="" />`;
    caption.textContent = item.caps ? (item.caps[lang] || item.caps.sq) : "";
  }
}

function lbNav(dir) {
  const vid = document.getElementById("lbContent").querySelector("video");
  if (vid) { vid.pause(); vid.src = ""; }
  lbIndex = (lbIndex + dir + LB_ITEMS.length) % LB_ITEMS.length;
  renderLightbox();
}

document.getElementById("lbClose").addEventListener("click", closeLightbox);
document.getElementById("lbPrev").addEventListener("click", () => lbNav(-1));
document.getElementById("lbNext").addEventListener("click", () => lbNav(1));
document.getElementById("lbOverlay").addEventListener("click", (e) => {
  if (e.target === document.getElementById("lbOverlay")) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (!document.getElementById("lbOverlay").classList.contains("active")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") lbNav(-1);
  if (e.key === "ArrowRight") lbNav(1);
});

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
