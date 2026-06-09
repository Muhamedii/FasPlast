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
  document.querySelectorAll("#galleryGrid .g-caption").forEach((el, i) => {
    if (GALLERY_PHOTOS[i]) el.textContent = GALLERY_PHOTOS[i].caps[newLang] || GALLERY_PHOTOS[i].caps.sq;
  });
  const heroCap = document.querySelector(".hero-slide-caption");
  if (heroCap && typeof HERO_SLIDES !== "undefined") {
    const caps = HERO_SLIDES[heroIndex].caps;
    heroCap.textContent = caps[newLang] || caps.sq;
  }
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
  { src: "img/gallery/glass-wall-de-1.png", cat: "de",  badge: "🇩🇪", caps: { sq: "Mure xhami panoramike — Gjermani", de: "Panorama-Glaswand — Deutschland", en: "Panoramic glass wall — Germany" } },
  { src: "img/gallery/house-xk-facade.png", cat: "xk",  badge: "🇽🇰", caps: { sq: "Shtëpi individuale — Kosovë", de: "Einfamilienhaus — Kosovo", en: "Residential house — Kosovo" } },
  { src: "img/gallery/glass-wall-de-2.png", cat: "de",  badge: "🇩🇪", caps: { sq: "Sisteme xhami — Gjermani", de: "Glassystem — Deutschland", en: "Glass system — Germany" } },
  { src: "img/gallery/door-anthracite.png", cat: "xk",  badge: null,   caps: { sq: "Derë hyrëse antracit", de: "Haustür Anthrazit", en: "Anthracite entry door" } },
  { src: "img/gallery/commercial-xk.png",  cat: "xk",  badge: "🇽🇰", caps: { sq: "Objekt komercial — Kosovë", de: "Gewerbeobjekt — Kosovo", en: "Commercial building — Kosovo" } },
  { src: "img/gallery/gable-window-de.png",cat: "de",  badge: "🇩🇪", caps: { sq: "Dritare me porosi — Gjermani", de: "Sonderfenster — Deutschland", en: "Custom window — Germany" } },
  { src: "img/gallery/house-de-after.png", cat: "de",  badge: "🇩🇪", caps: { sq: "Dritare & dyer të reja — Gjermani", de: "Neue Fenster & Türen — Deutschland", en: "New windows & doors — Germany" } },
  { src: "img/gallery/house-xk-detail.png",cat: "xk",  badge: "🇽🇰", caps: { sq: "Dritare & roleta — Kosovë", de: "Fenster & Rollläden — Kosovo", en: "Windows & shutters — Kosovo" } },
  { src: "img/gallery/export-canada.png",  cat: "exp", badge: "🇨🇦", caps: { sq: "Eksport drejt Kanadasë", de: "Export nach Kanada", en: "Export to Canada" } },
  { src: "img/gallery/house-de-before.png",cat: "de",  badge: "🇩🇪", caps: { sq: "Projekt renovimi — Gjermani", de: "Sanierungsprojekt — Deutschland", en: "Renovation project — Germany" } },
  { src: "img/gallery/house-de-mid.png",   cat: "de",  badge: "🇩🇪", caps: { sq: "Montimi në proces — Gjermani", de: "Montage im Gange — Deutschland", en: "Installation in progress — Germany" } },
  { src: "img/gallery/export-loading.png", cat: "exp", badge: null,   caps: { sq: "Ngarkesë për eksport", de: "Export-Verladung", en: "Loading for export" } },
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
  item.className = "g-item" + (p.featured ? " featured" : "");
  item.dataset.cat = p.cat;
  item.innerHTML = `
    ${p.badge ? `<span class="g-badge">${p.badge}</span>` : ""}
    <div class="g-caption">${p.caps[lang] || p.caps.sq}</div>
    <img src="${p.src}" alt="${p.caps.en}" loading="lazy" />
  `;
  item.addEventListener("click", () => openLightbox(GALLERY_VIDEOS.length + i));
  galleryGrid.appendChild(item);
});

// Filters
document.querySelectorAll("#galleryFilters button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#galleryFilters button").forEach((b) =>
      b.classList.toggle("active", b === btn)
    );
    const f = btn.dataset.filter;
    document.querySelectorAll("#galleryGrid .g-item").forEach((el) => {
      el.classList.toggle("hidden", f !== "all" && el.dataset.cat !== f);
    });
  });
});

// ----- Hero slider -----
const HERO_SLIDES = [
  { src: "img/gallery/glass-wall-de-1.png", caps: { sq: "🇩🇪 Mure xhami — Gjermani", de: "🇩🇪 Glaswand — Deutschland", en: "🇩🇪 Glass wall — Germany" } },
  { src: "img/gallery/house-xk-facade.png", caps: { sq: "🇽🇰 Shtëpi — Kosovë", de: "🇽🇰 Haus — Kosovo", en: "🇽🇰 House — Kosovo" } },
  { src: "img/gallery/door-anthracite.png", caps: { sq: "Derë hyrëse antracit", de: "Haustür Anthrazit", en: "Anthracite entry door" } },
  { src: "img/gallery/glass-wall-de-2.png", caps: { sq: "🇩🇪 Sisteme xhami — Gjermani", de: "🇩🇪 Glassystem — Deutschland", en: "🇩🇪 Glass system — Germany" } },
  { src: "img/gallery/house-de-after.png",  caps: { sq: "🇩🇪 Dritare të reja — Gjermani", de: "🇩🇪 Neue Fenster — Deutschland", en: "🇩🇪 New windows — Germany" } },
];
let heroIndex = 0;
let heroTimer = null;

const heroSlider = document.getElementById("heroSlider");
const heroDots = document.getElementById("heroDots");
const heroCaption = document.createElement("div");
heroCaption.className = "hero-slide-caption show";
heroSlider.appendChild(heroCaption);

HERO_SLIDES.forEach((s, i) => {
  const img = document.createElement("img");
  img.src = s.src;
  img.alt = s.caps.en;
  if (i === 0) img.classList.add("active");
  heroSlider.insertBefore(img, heroDots);

  const dot = document.createElement("button");
  dot.setAttribute("aria-label", `Slide ${i + 1}`);
  if (i === 0) dot.classList.add("active");
  dot.addEventListener("click", () => { heroGoTo(i); heroRestart(); });
  heroDots.appendChild(dot);
});

function heroGoTo(i) {
  heroIndex = i;
  heroSlider.querySelectorAll("img").forEach((img, j) => img.classList.toggle("active", j === i));
  heroDots.querySelectorAll("button").forEach((b, j) => b.classList.toggle("active", j === i));
  const caps = HERO_SLIDES[i].caps;
  heroCaption.textContent = caps[lang] || caps.sq;
}

function heroRestart() {
  clearInterval(heroTimer);
  heroTimer = setInterval(() => heroGoTo((heroIndex + 1) % HERO_SLIDES.length), 4000);
}

heroGoTo(0);
heroRestart();

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
