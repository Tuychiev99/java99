let artworks = [];
const gallery = document.getElementById("galleryContainer");
const searchInput = document.getElementById("searchInput");
const tagFilter = document.getElementById("tagFilter");

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const modalPrompt = document.getElementById("modalPrompt");
const closeModal = document.getElementById("closeModal");

// Load JSON
fetch("data/gallery.json")
  .then(res => res.json())
  .then(data => {
    artworks = data;
    renderGallery(data);
  });

// Render gallery
function renderGallery(list) {
  gallery.innerHTML = "";

  list.forEach(art => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${art.image}" alt="${art.title}" title="${art.title}">
      <div class="card-title">${art.title}</div>
    `;

    card.addEventListener("click", () => openModal(art));

    gallery.appendChild(card);
  });
}

// Search
searchInput.addEventListener("input", () => {
  filterArtworks();
});

// Tag filter
tagFilter.addEventListener("change", () => {
  filterArtworks();
});

// Filtering logic
function filterArtworks() {
  const keyword = searchInput.value.toLowerCase();
  const tag = tagFilter.value;

  const filtered = artworks.filter(art => {
    const matchKeyword =
      art.title.toLowerCase().includes(keyword) ||
      art.prompt.toLowerCase().includes(keyword);

    const matchTag =
      tag === "all" || art.tags.includes(tag);

    return matchKeyword && matchTag;
  });

  renderGallery(filtered);
}

// Modal
function openModal(art) {
  modal.style.display = "block";
  modalImg.src = art.image;
  modalImg.alt = art.title;
  modalImg.title = art.title;
  modalTitle.textContent = art.title;
  modalPrompt.textContent = art.prompt;
}

// Close Modal
closeModal.onclick = () => (modal.style.display = "none");
window.onclick = e => {
  if (e.target === modal) modal.style.display = "none";
};

// Load generated AI images from localStorage  
function loadLocalGenerated() {
  const saved = JSON.parse(localStorage.getItem("generatedArt")) || [];
  artworks = artworks.concat(saved);
  renderGallery(artworks);
}

// After JSON load:
fetch("data/gallery.json")
  .then(res => res.json())
  .then(data => {
    artworks = data;
    loadLocalGenerated();
  });
function loadLocalGenerated() {
  const saved = JSON.parse(localStorage.getItem("generatedArt")) || [];
  artworks = artworks.concat(saved);
  renderGallery(artworks);
}

// JSON 로드 후 실행
fetch("data/gallery.json")
  .then(res => res.json())
  .then(data => {
    artworks = data;
    loadLocalGenerated();
  });

  
