const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

async function loadFavorites() {
  const token = localStorage.getItem('token');
  if (!token) return favoriteIds = [];

  const res = await fetch('/api/favorites', {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await res.json();
  favoriteIds = data.favorites.map(f => f._id);
}

async function loadProduct() {
  const res = await fetch(`/api/products/details/${productId}`);
  const data = await res.json();

  if (!res.ok) return alert(data.error);

  const container = document.getElementById('product-detail');

  // Main product content
  container.innerHTML = `
    <img src="${data.product.image}" alt="${data.product.name}">
    <h2>${data.product.name}</h2>
    <p>${data.product.brand} — ${data.product.type}</p>
    <p>$${data.product.price}</p>
    <p>${data.product.description}</p>
    <button onclick="toggleFavorite('${data.product._id}')" id="fav-btn-${data.product._id}">
      ${favoriteIds.includes(data.product._id) ? 'Unfavorite' : 'Favorite'}
    </button>
    <h3>Related Products</h3>
    <div id="related-products"></div>
  `;

  // Related products
  const relatedRes = await fetch(`/api/products?brand=${data.product.brand}`);
  const relatedData = await relatedRes.json();

  const related = document.getElementById('related-products');
  related.innerHTML = '';

  relatedData.products
    .filter(p => p._id !== productId)
    .forEach(p => {
      const div = document.createElement('div');
      div.className = 'related-card';
      div.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <a href="/product.html?id=${p._id}">${p.name}</a>
      `;
      related.appendChild(div);
    });
}

window.toggleFavorite = async (id) => {
  const token = localStorage.getItem('token');
  if (!token) return alert("Please login to favorite");

  const isFav = favoriteIds.includes(id);
  const method = isFav ? 'DELETE' : 'POST'

  try {
    const res = await fetch(`/api/favorites/${id}`, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
  });

  if (!res.ok) {
    const err = await res.json();
    console.error('Favorite failed:', err);
    alert(`Failed to update favorite: ${err.error}`);
    return;
  }

  const data = await res.json();
  favoriteIds = data.favorites.map(fav => fav._id);

  await loadFavorites();
  loadProduct();

} catch (err) {
  console.error('Fetch error:', err);
  alert('Something went wrong.');
}
};

document.addEventListener('DOMContentLoaded', () => {
  loadFavorites().then(loadProduct);
});