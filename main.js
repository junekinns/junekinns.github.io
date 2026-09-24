// Fills each .media slot with its video / image / before-after pair.
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
  const { kind, src, before, after } = slot.dataset;
  const label = slot.dataset.label || "";

  if (kind === "video") {
    const box = placeholder(slot, [src]);
    const video = Object.assign(document.createElement("video"), {
      muted: true, loop: true, playsInline: true, preload: "metadata",
    });
    video.setAttribute("aria-label", label);
    video.addEventListener("loadeddata", () => {
      box.remove();
      slot.append(video);
      viewer.observe(video);
    }, { once: true });
    video.src = src;
  }

  if (kind === "image") {
    const box = placeholder(slot, [src]);
    loadImage(src).then((img) => {
      img.alt = label;
      box.replaceWith(img);
    }).catch(() => {});
  }

  if (kind === "compare") {
    const box = placeholder(slot, [before, after]);
    Promise.all([loadImage(before), loadImage(after)]).then(([a, b]) => {
      a.alt = "Before"; b.alt = "After";
      b.className = "compare__after";
      const wrap = document.createElement("div");
      wrap.className = "compare";
      const range = Object.assign(document.createElement("input"), {
        type: "range", min: 0, max: 100, value: 50,
      });
      range.setAttribute("aria-label", "Drag to compare before and after");
      range.addEventListener("input", () => wrap.style.setProperty("--pos", range.value + "%"));
      wrap.innerHTML =
        '<span class="compare__label" style="left:8px">Before</span>' +
        '<span class="compare__label" style="right:8px">After</span>';
      wrap.prepend(a, b);
      wrap.append(Object.assign(document.createElement("div"), { className: "compare__line" }), range);
      box.replaceWith(wrap);
    }).catch(() => {});
  }
}
