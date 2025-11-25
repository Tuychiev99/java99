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
