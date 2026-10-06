// Fills each .media slot with its video or image.
// If the file isn't there yet, a labelled placeholder stays in its place.

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Videos play only while visible.
const viewer = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting && !reduceMotion) e.target.play().catch(() => {});
    else e.target.pause();
  }
}, { threshold: 0.4 });

function placeholder(slot, files) {
  const box = document.createElement("div");
  box.className = "media__placeholder";
  box.innerHTML = `<span>${slot.dataset.label || "Media"}</span>` +
    files.map((f) => `<code>${f}</code>`).join("");
  slot.append(box);
  return box;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

for (const slot of document.querySelectorAll(".media")) {
  const { kind, src } = slot.dataset;
  const label = slot.dataset.label || "";

  if (kind === "video") {
    const box = placeholder(slot, [src]);
    const video = Object.assign(document.createElement("video"), {
      muted: true, loop: true, playsInline: true, preload: "metadata",
    });
    video.setAttribute("aria-label", label);
    // iOS Safari never fires "loadeddata" with preload="metadata" (it fetches
    // no frame data until playback), so swap in on "loadedmetadata" instead.
    video.addEventListener("loadedmetadata", () => {
      box.remove();
      slot.append(video);
      viewer.observe(video);
    }, { once: true });
    video.src = src;
    video.load();
  }

  if (kind === "image") {
    const box = placeholder(slot, [src]);
    loadImage(src).then((img) => {
      img.alt = label;
      box.replaceWith(img);
    }).catch(() => {});
  }
}

