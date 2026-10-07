const grid = document.querySelector("#system-grid");
const searchInput = document.querySelector("#system-search");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");

function makeSystemCard(system, index) {
  const card = document.createElement("a");
  card.className = "system-card";
  card.href = `item.html?id=${encodeURIComponent(system.id || system.name || "")}`;
  card.style.setProperty("--card-index", index);

  const imageWrap = document.createElement("div");
  imageWrap.className = "system-card-image";
  const image = document.createElement("img");
  image.src = system.image || system.gallery?.[0]?.src || "";
  image.alt =
    system.imageAlt ||
    system.gallery?.[0]?.alt ||
    system.name ||
    "تصویر سیستم‌عامل";
  image.loading = "lazy";
  if (system.imageMode === "icon") image.classList.add("os-icon-image");
  const number = document.createElement("span");
  number.className = "card-number";
  number.textContent = String(index + 1).padStart(2, "0");
  const arrow = document.createElement("span");
  arrow.className = "card-arrow";
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "↗";
  imageWrap.append(image, number, arrow);

  const body = document.createElement("div");
  body.className = "system-card-body";
  const meta = document.createElement("div");
  meta.className = "card-meta";
  const category = document.createElement("span");
  category.textContent = system.category || "سیستم‌عامل";
  const license = document.createElement("span");
  license.textContent = system.license || "قابل دریافت";
  meta.append(category, license);
  const title = document.createElement("h3");
  title.textContent = system.name || "سیستم‌عامل جدید";
  const description = document.createElement("p");
  description.textContent =
    system.shortDescription ||
    system.description ||
    "برای مشاهدهٔ اطلاعات و دریافت، وارد صفحهٔ این سیستم‌عامل شوید.";
  const note = document.createElement("div");
  note.className = "card-note";
  note.innerHTML =
    '<span class="status-dot" aria-hidden="true"></span> ادامه مطلب و دانلود <span aria-hidden="true">←</span>';
  body.append(meta, title, description, note);
  card.append(imageWrap, body);
  return card;
}

function renderSystems(systems) {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const filtered = systems.filter((system) =>
    `${system.name || ""} ${system.category || ""} ${system.shortDescription || ""}`
      .toLocaleLowerCase()
      .includes(query),
  );

  grid.replaceChildren(...filtered.map(makeSystemCard));
  resultCount.textContent = `${filtered.length} سیستم‌عامل`;
  emptyState.hidden = filtered.length > 0;
}

async function loadSystems() {
  try {
    const data = await loadCatalog();
    renderSystems(data.systems);
    searchInput.addEventListener("input", () => renderSystems(data.systems));
    document.addEventListener("keydown", (event) => {
      if (event.key === "/" && document.activeElement !== searchInput) {
        event.preventDefault();
        searchInput.focus();
      }
    });
  } catch (error) {
    resultCount.textContent = "فهرست در دسترس نیست";
    emptyState.hidden = false;
    emptyState.textContent = "فهرست بارگذاری نشد. دوباره تلاش کنید.";
    console.error("Unable to load the OS catalog:", error);
  }
}

loadSystems();
