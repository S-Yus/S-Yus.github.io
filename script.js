if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    window.scrollTo(0, 0);
  }
});

document.getElementById("year").textContent = new Date().getFullYear();
