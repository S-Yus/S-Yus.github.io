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
let requestedSection = -1;

function updateCurrentSection() {
  framePending = false;
  let current = -1;
  sections.forEach((section, index) => {
    if (section.getBoundingClientRect().top <= anchorOffset + 1) current = index;
  });

  // Short pages can reach the bottom before the selected section reaches the header.
  const root = document.documentElement;
  if (Math.ceil(window.scrollY + window.innerHeight) >= root.scrollHeight - 2) {
    if (requestedSection >= 0) current = requestedSection;
    else if (window.scrollY > 0) current = sections.length - 1;
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
  requestedSection = -1;
  anchorOffset = Math.ceil(header.getBoundingClientRect().height) + 24;
  document.documentElement.style.setProperty("--anchor-offset", `${anchorOffset}px`);
  scheduleSectionUpdate();
}

measureHeader();
if ("ResizeObserver" in window) new ResizeObserver(measureHeader).observe(header);
window.addEventListener("resize", measureHeader);
window.addEventListener("scroll", scheduleSectionUpdate, { passive: true });
function clearRequestedSection() {
  requestedSection = -1;
  scheduleSectionUpdate();
}

document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  requestedSection = sections.findIndex((section) => `#${section.id}` === link.hash);
  scheduleSectionUpdate();
});

window.addEventListener("wheel", clearRequestedSection, { passive: true });
window.addEventListener("touchmove", clearRequestedSection, { passive: true });
window.addEventListener("keydown", (event) => {
  if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) clearRequestedSection();
});
window.addEventListener("pageshow", clearRequestedSection);
