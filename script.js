const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Mobile nav ---------- */
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

/* ---------- Scroll progress bar ---------- */
const progressBar = document.querySelector(".scroll-progress");

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = pct + "%";
}

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

/* ---------- Reveal on scroll ---------- */
const revealEls = document.querySelectorAll(".reveal");

if (prefersReducedMotion) {
  revealEls.forEach((el) => el.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
}

/* ---------- Skill bars ---------- */
const skillFills = document.querySelectorAll(".skill-fill");

if (!prefersReducedMotion && skillFills.length) {
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  skillFills.forEach((el) => skillObserver.observe(el));
} else {
  skillFills.forEach((el) => el.classList.add("animated"));
}

/* ---------- Animated counters ---------- */
const counters = document.querySelectorAll(".stat-num");

function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if (prefersReducedMotion) {
  counters.forEach((el) => (el.textContent = el.dataset.count));
} else {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => counterObserver.observe(el));
}

/* ---------- Typing effect for hero role ---------- */
const roles = [
  "Quality Engineering Lead, AI & Automation",
  "GenAI Practitioner",
  "API Automation Architect",
  "SDET Mentor & Delivery Owner",
];
const typedEl = document.getElementById("typed-role");

if (!prefersReducedMotion && typedEl) {
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let deleting = true;

  function typeLoop() {
    const current = roles[roleIndex];

    if (deleting) {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
      setTimeout(typeLoop, 35);
    } else {
      charIndex++;
      typedEl.textContent = roles[roleIndex].slice(0, charIndex);
      if (charIndex === roles[roleIndex].length) {
        deleting = true;
        setTimeout(typeLoop, 2400);
        return;
      }
      setTimeout(typeLoop, 70);
    }
  }

  setTimeout(typeLoop, 2400);
}

/* ---------- ScrollSpy active nav indicator ---------- */
const spySections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll(".nav-links a[href^='#']");

function updateScrollSpy() {
  const fromTop = window.scrollY + 120;

  let currentId = "";
  spySections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    if (fromTop >= top && fromTop < top + height) {
      currentId = section.getAttribute("id");
    }
  });

  if (currentId) {
    navAnchors.forEach((a) => {
      if (a.getAttribute("href") === `#${currentId}`) {
        a.classList.add("active");
      } else {
        a.classList.remove("active");
      }
    });
  }
}

window.addEventListener("scroll", updateScrollSpy, { passive: true });
updateScrollSpy();

/* ---------- 1-Click Copy Email & Toast Notification ---------- */
const toastEl = document.getElementById("toast");
let toastTimer;

function showToast(msg) {
  if (!toastEl) return;
  const msgSpan = toastEl.querySelector(".toast-msg");
  if (msgSpan) msgSpan.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("show");
  }, 2800);
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`Copied ${text} to clipboard! ✨`);
    }).catch(() => {
      fallbackCopyText(text);
    });
  } else {
    fallbackCopyText(text);
  }
}

function fallbackCopyText(text) {
  const input = document.createElement("input");
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
  showToast(`Copied ${text} to clipboard! ✨`);
}

document.querySelectorAll("[data-email]").forEach((el) => {
  el.addEventListener("click", (e) => {
    const email = el.getAttribute("data-email");
    if (email) {
      copyToClipboard(email);
    }
  });
});

/* ---------- Header elevation on scroll ---------- */
const siteHeader = document.querySelector(".site-header");
function handleHeaderElevation() {
  if (window.scrollY > 20) {
    siteHeader?.classList.add("scrolled");
  } else {
    siteHeader?.classList.remove("scrolled");
  }
}
window.addEventListener("scroll", handleHeaderElevation, { passive: true });
handleHeaderElevation();

/* ---------- Skill Tag Interactive Filtering ---------- */
const filterableTags = document.querySelectorAll(".tags li, .chip-list li");
const filterableCards = document.querySelectorAll(".timeline-card, .project-card");
let activeTagText = "";

filterableTags.forEach((tag) => {
  tag.addEventListener("click", () => {
    const text = tag.textContent.trim().toLowerCase();

    if (activeTagText === text) {
      // Clear filter
      activeTagText = "";
      filterableTags.forEach((t) => t.classList.remove("active-tag"));
      filterableCards.forEach((card) => {
        card.classList.remove("dimmed", "highlighted");
      });
      showToast("Filter cleared");
    } else {
      // Set new filter
      activeTagText = text;
      filterableTags.forEach((t) => {
        if (t.textContent.trim().toLowerCase() === text) {
          t.classList.add("active-tag");
        } else {
          t.classList.remove("active-tag");
        }
      });

      let matchCount = 0;
      filterableCards.forEach((card) => {
        const cardContent = card.textContent.toLowerCase();
        if (cardContent.includes(text)) {
          card.classList.add("highlighted");
          card.classList.remove("dimmed");
          matchCount++;
        } else {
          card.classList.remove("highlighted");
          card.classList.add("dimmed");
        }
      });

      showToast(`Filtering by "${tag.textContent.trim()}" (${matchCount} matches) ✨`);
    }
  });
});
