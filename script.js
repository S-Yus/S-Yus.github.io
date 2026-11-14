if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
});

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }
});

document.getElementById("year").textContent = new Date().getFullYear();

const header = document.querySelector(".site-header");
const sectionLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
const sections = sectionLinks.map((link) => document.querySelector(link.hash));
let anchorOffset = 96;
let framePending = false;

function updateCurrentSection() {
  framePending = false;
  let current = -1;
  sections.forEach((section, index) => {
    if (section.getBoundingClientRect().top <= anchorOffset + 1) current = index;
  });

  // The final section can be too short to reach the header before the page ends.
  const root = document.documentElement;
  if (window.scrollY > 0 && Math.ceil(window.scrollY + window.innerHeight) >= root.scrollHeight - 2) {
    current = sections.length - 1;
  }

  sectionLinks.forEach((link, index) => {
    if (index === current) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}

function scheduleSectionUpdate() {
  if (framePending) return;
  framePending = true;
  requestAnimationFrame(updateCurrentSection);
}

function measureHeader() {
  anchorOffset = Math.ceil(header.getBoundingClientRect().height) + 24;
  document.documentElement.style.setProperty("--anchor-offset", `${anchorOffset}px`);
  scheduleSectionUpdate();
}

measureHeader();
if ("ResizeObserver" in window) new ResizeObserver(measureHeader).observe(header);
window.addEventListener("resize", measureHeader);
window.addEventListener("scroll", scheduleSectionUpdate, { passive: true });
window.addEventListener("pageshow", scheduleSectionUpdate);
