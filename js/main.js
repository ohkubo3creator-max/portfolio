/* =========================================================
   翔啓 / Shokei — Portfolio interactions
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header scrolled state ---------- */
  var header = document.querySelector(".site-header");
  var onScroll = function () {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 10);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    var setMenu = function (open) {
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    };
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") setMenu(false);
    });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Active nav link on scroll ---------- */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll('.nav__menu a[href^="#"]');
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute("id");
          navLinks.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { threshold: 0.55 });
    sections.forEach(function (sec) { spy.observe(sec); });
  }

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var lbMedia = document.getElementById("lb-media");
  var lbTitle = document.getElementById("lb-title");
  var lbDesc = document.getElementById("lb-desc");
  var lbTags = document.getElementById("lb-tags");
  var lbResult = document.getElementById("lb-result");
  var lastFocused = null;

  var openLightbox = function (work) {
    var img = work.getAttribute("data-img");
    var title = work.getAttribute("data-title") || "";
    var desc = work.getAttribute("data-desc") || "";
    var tags = (work.getAttribute("data-tags") || "").split("/").map(function (t) { return t.trim(); }).filter(Boolean);
    var result = work.getAttribute("data-result") || "";

    // Media: real image, or clone the placeholder visual
    if (img) {
      lbMedia.innerHTML = '<img src="' + img + '" alt="' + title.replace(/"/g, "&quot;") + '" />';
    } else {
      var ph = work.querySelector(".work__media--ph");
      lbMedia.innerHTML = ph ? ph.outerHTML : "";
    }

    lbTitle.textContent = title;
    lbDesc.textContent = desc;
    lbResult.textContent = result ? "📈 " + result : "";
    lbTags.innerHTML = "";
    tags.forEach(function (t) {
      var s = document.createElement("span");
      s.textContent = t;
      lbTags.appendChild(s);
    });

    lastFocused = document.activeElement;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var closeBtn = lightbox.querySelector(".lightbox__close");
    if (closeBtn) closeBtn.focus();
  };

  var closeLightbox = function () {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  };

  document.querySelectorAll(".work").forEach(function (work) {
    work.setAttribute("tabindex", "0");
    work.setAttribute("role", "button");
    work.addEventListener("click", function () { openLightbox(work); });
    work.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(work); }
    });
  });

  if (lightbox) {
    lightbox.querySelectorAll("[data-close]").forEach(function (el) {
      el.addEventListener("click", closeLightbox);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
    });
  }
})();
