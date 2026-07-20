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
