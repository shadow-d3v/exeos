const content = document.querySelector("#item-content");

function makeSection(titleText, body) {
  const section = document.createElement("section");
  section.className = "detail-section";
  const title = document.createElement("h2");
  title.textContent = titleText;
  section.append(title, body);
  return section;
}

function renderSystem(system) {
  document.title = `exeos | ${system.name || "سیستم‌عامل"} `;
  const layout = document.createElement("div");
  layout.className = "detail-layout";

  const gallery = document.createElement("div");
  gallery.className = "detail-gallery";
  const imageWrap = document.createElement("div");
  imageWrap.className = "detail-image-wrap";
  const image = document.createElement("img");
  const images = system.gallery?.length
    ? system.gallery
    : [
        {
          src: system.image || "",
          alt: system.imageAlt || system.name || "تصویر سیستم‌عامل",
        },
      ];
  image.src = images[0].src;
  image.alt = images[0].alt;
  image.fetchPriority = "high";
  const firstImageMode = images[0].mode || system.imageMode;
  image.classList.add(
    firstImageMode === "screenshot" ? "os-screenshot-image" : "os-icon-image",
  );
  const imageLabel = document.createElement("div");
  imageLabel.className = "detail-image-label";
  const category = document.createElement("span");
  category.textContent = system.category || "سیستم‌عامل";
  const license = document.createElement("span");
  license.textContent = system.license || "قابل دریافت";
  imageLabel.append(category, license);
  imageWrap.append(image, imageLabel);

  const thumbnails = document.createElement("div");
  thumbnails.className = "detail-thumbnails";
  thumbnails.setAttribute("aria-label", "تصاویر سیستم‌عامل");
  images.forEach((entry, index) => {
    const thumbnail = document.createElement("button");
    thumbnail.className = "detail-thumbnail";
    thumbnail.type = "button";
    thumbnail.setAttribute("aria-label", `نمایش تصویر ${index + 1}`);
    thumbnail.setAttribute("aria-pressed", String(index === 0));
    const thumbImage = document.createElement("img");
    thumbImage.src = entry.src;
    thumbImage.alt = "";
    thumbImage.loading = "lazy";
    const imageMode = entry.mode || system.imageMode;
    thumbImage.classList.add(
      imageMode === "screenshot" ? "os-screenshot-image" : "os-icon-image",
    );
    thumbnail.append(thumbImage);
    thumbnail.addEventListener("click", () => {
      image.src = entry.src;
      image.alt = entry.alt;
      image.classList.remove("os-icon-image", "os-screenshot-image");
      image.classList.add(
        (entry.mode || system.imageMode) === "screenshot"
          ? "os-screenshot-image"
          : "os-icon-image",
      );
      thumbnails
        .querySelectorAll("button")
        .forEach((button) => button.setAttribute("aria-pressed", "false"));
      thumbnail.setAttribute("aria-pressed", "true");
    });
    thumbnails.append(thumbnail);
  });
  gallery.append(imageWrap, thumbnails);

  const copy = document.createElement("div");
  copy.className = "detail-copy";
  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = `${system.name || "Operating System"} / سیستم‌عامل`;
  const title = document.createElement("h1");
  title.textContent = system.name || "سیستم‌عامل جدید";
  const tagline = document.createElement("p");
  tagline.className = "detail-tagline";
  tagline.textContent = system.tagline || "اطلاعات و دریافت سیستم‌عامل";
  const description = document.createElement("p");
  description.className = "detail-description";
  description.textContent = system.description || system.shortDescription || "";

  const download = document.createElement("a");
  download.className = "download-button";
  download.textContent = "دانلود";
  if (system.storeDownloadUrl) {
    download.href = system.storeDownloadUrl;
    download.setAttribute("download", "");
  } else {
    download.href = system.officialUrl || "#";
    download.target = "_blank";
    download.rel = "noopener noreferrer";
    download.title = "رفتن به صفحهٔ رسمی دانلود";
  }
  const downloadNote = document.createElement("p");
  downloadNote.className = "download-note";
  const downloadNoteIcon = document.createElement("span");
  downloadNoteIcon.className = "download-note-icon";
  downloadNoteIcon.setAttribute("aria-hidden", "true");
  downloadNoteIcon.textContent = "✓";
  const downloadNoteText = document.createElement("span");
  downloadNoteText.textContent = "تهیه‌شده از وب‌سایت رسمی سیستم‌عامل";
  downloadNote.append(downloadNoteIcon, downloadNoteText);
  const officialLink = document.createElement("a");
  officialLink.className = "official-link";
  officialLink.href = system.officialUrl || "#";
  officialLink.target = "_blank";
  officialLink.rel = "noopener noreferrer";
  officialLink.textContent = "مشاهدهٔ صفحهٔ رسمی این سیستم‌عامل ↗";

  const productFacts = document.createElement("dl");
  productFacts.className = "product-facts";
  for (const [label, value] of [
    ["نسخه", system.version],
    ["معماری", system.architecture],
    ["حجم", system.size],
    ["هزینه", system.price],
  ]) {
    const fact = document.createElement("div");
    const term = document.createElement("dt");
    term.textContent = label;
    const detail = document.createElement("dd");
    detail.textContent = value;
    fact.append(term, detail);
    productFacts.append(fact);
  }

  const features = document.createElement("ul");
  features.className = "feature-list";
  for (const feature of system.highlights || []) {
    const item = document.createElement("li");
    item.textContent = feature;
    features.append(item);
  }
  const requirements = document.createElement("p");
  requirements.textContent =
    system.requirements ||
    "برای مشاهدهٔ نیازمندی‌های دقیق به وب‌سایت رسمی مراجعه کنید.";

  copy.append(
    eyebrow,
    title,
    tagline,
    description,
    download,
    downloadNote,
    officialLink,
    productFacts,
    makeSection("نیازمندی‌ها و نصب", requirements),
    makeSection("ویژگی‌های سیستم‌عامل", features),
  );
  layout.append(gallery, copy);
  content.replaceChildren(content.querySelector(".back-link"), layout);
}

function renderError(message) {
  const error = document.createElement("div");
  error.className = "detail-error";
  const title = document.createElement("h1");
  title.textContent = "سیستم‌عامل پیدا نشد.";
  const description = document.createElement("p");
  description.textContent = message;
  const link = document.createElement("a");
  link.className = "text-link";
  link.href = "index.html#systems";
  link.textContent = "بازگشت به فروشگاه";
  error.append(title, description, link);
  content.replaceChildren(content.querySelector(".back-link"), error);
}

async function loadSystem() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) {
    renderError("برای دیدن مشخصات، یک سیستم‌عامل را از فروشگاه انتخاب کنید.");
    return;
  }

  try {
    const data = await loadCatalog();
    const system = data.systems.find(
      (entry) => (entry.id || entry.name) === id,
    );
    if (!system) {
      renderError("این سیستم‌عامل هنوز در فروشگاه قرار نگرفته است.");
      return;
    }
    renderSystem(system);
  } catch (error) {
    renderError(
      "مشخصات بارگذاری نشد. سایت را از طریق وب‌سرور محلی باز کنید و دوباره تلاش کنید.",
    );
    console.error("Unable to load system details:", error);
  }
}

loadSystem();
