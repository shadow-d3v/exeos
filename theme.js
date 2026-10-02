const themeToggle = document.querySelector("#theme-toggle");
const menuToggle = document.querySelector("#menu-toggle");
const primaryNavigation = document.querySelector("#primary-navigation");
const savedTheme = localStorage.getItem("os-store-theme");

document.documentElement.dataset.theme =
  savedTheme === "dark" ? "dark" : "light";

function updateThemeControl() {
  const isDark = document.documentElement.dataset.theme === "dark";
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "فعال‌کردن حالت روشن" : "فعال‌کردن حالت تاریک",
  );
  themeToggle.title = isDark ? "حالت روشن" : "حالت تاریک";
  themeToggle.querySelector("span").textContent = isDark ? "☼" : "◐";
}

updateThemeControl();
themeToggle.addEventListener("click", () => {
  const nextTheme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem("os-store-theme", nextTheme);
  updateThemeControl();
});

function setMenuOpen(isOpen) {
  primaryNavigation.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "بستن منو" : "باز کردن منو");
}

menuToggle.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

primaryNavigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenuOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuOpen(false);
});

document.addEventListener("click", (event) => {
  if (
    menuToggle.getAttribute("aria-expanded") === "true" &&
    !primaryNavigation.contains(event.target)
  ) {
    setMenuOpen(false);
  }
});
