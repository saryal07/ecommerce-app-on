document.addEventListener('DOMContentLoaded', () => {
  const productContainer = document.getElementById('product-gallery');
  const brandFilters = document.getElementById('brand-filters');
  const typeFilters = document.getElementById('type-filters');
  const pageInfo = document.getElementById('page-info');
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');
  const logoutLink = document.getElementById('logout-link');
  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');

  let page = 1;
  let favoriteIds = [];

  function updateAuthUI() {
    const token = localStorage.getItem('token');
    if (token) {
      logoutLink.style.display = 'inline';
      loginLink.style.display = 'none';
      registerLink.style.display = 'none';
    } else {
      logoutLink.style.display = 'none';
      loginLink.style.display = 'inline';
      registerLink.style.display = 'inline';
    }
  }

  logoutLink.addEventListener('click', () => {
    localStorage.removeItem('token');
    updateAuthUI();
    localStorage.removeItem('favorites');
    loadFavorites();
  });

  let selectedBrands = [];
  let selectedTypes = [];

  async function loadFilters() {
    const res = await fetch('/api/products/filters');
    const { brands, types } = await res.json();

    brandFilters.innerHTML = brands.map(b => `
      <label><input type="checkbox" class="brand-filter" value="${b}"> ${b}</label>
    `).join('');

    typeFilters.innerHTML = types.map(t => `
      <label><input type="checkbox" class="type-filter" value="${t}"> ${t}</label>
    `).join('');

    document.querySelectorAll('.brand-filter').forEach(input =>
      input.addEventListener('change', () => {
        selectedBrands = Array.from(document.querySelectorAll('.brand-filter:checked')).map(i => i.value);
        page = 1;
        loadProducts();
      })
    );

    document.querySelectorAll('.type-filter').forEach(input =>
      input.addEventListener('change', () => {
        selectedTypes = Array.from(document.querySelectorAll('.type-filter:checked')).map(i => i.value);
        page = 1;
        loadProducts();
      })
    );
  }

  const toggleFavorites = document.getElementById('toggle-favorites');
  const sidebar = document.getElementById('favorites-sidebar');

  toggleFavorites.addEventListener('click', (e) => {
    e.preventDefault();
    sidebar.classList.toggle('visible');
  });

  async function loadProducts() {
    const query = new URLSearchParams({ page });

    if (selectedBrands.length) query.set('brand', selectedBrands.join(';'));
    if (selectedTypes.length) query.set('type', selectedTypes.join(';'));

    const res = await fetch(`/api/products?${query.toString()}`);
    const data = await res.json();

    productContainer.innerHTML = '';
    if (data.products.length === 0) {
      productContainer.innerHTML = '<p>No products found.</p>';
    } else {
      data.products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';

        const isFav = favoriteIds.includes(p._id);

        card.innerHTML = `
          <a href="/product.html?id=${p._id}">
            <img src="${p.image}" alt="${p.name}">
            <h4>${p.name}</h4>
          </a>
          <p>${p.brand} — ${p.type}</p>
          <p>$${p.price}</p>
          <button onclick="toggleFavorite('${p._id}')" id="fav-btn-${p._id}">
            ${isFav ? '💔 Unfavorite' : '❤️ Favorite'}
          </button>
        `;
        productContainer.appendChild(card);
      });
    }

    pageInfo.textContent = `Page ${page}`;
    prevBtn.disabled = page <= 1;
    nextBtn.disabled = data.products.length < 9;
  }

  window.favoriteProduct = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return alert("Please login to favorite");

    const res = await fetch(`/api/favorites/${id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (res.ok) {
      loadFavorites(data.favorites); // refresh the sidebar
    } else {
      alert("Failed to favorite");
    }
  };


  window.unfavoriteProduct = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/favorites/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    loadFavorites();
  };

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

    loadFavorites();
    loadProducts();

  } catch (err) {
    console.error('Fetch error:', err);
    alert('Something went wrong.');
  }
  };

  async function loadFavorites() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch('/api/favorites', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    favoriteIds = data.favorites.map(p => p._id);

    const list = document.getElementById('favorites-list');
    list.innerHTML = '';
    data.favorites.forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = `
        <img src="${p.image}" alt="${p.name}" style="width: 50px; height: auto; margin-right: 10px;">
        <span>${p.name}</span>
        <span><button onclick="toggleFavorite('${p._id}')" id="fav-btn-${p._id}">💔</button></span>
      `;
      li.style.display = 'flex';
      li.style.alignItems = 'center';
      list.appendChild(li);
    });
  }


  prevBtn.addEventListener('click', () => {
    if (page > 1) {
      page--;
      loadProducts();
    }
  });

  nextBtn.addEventListener('click', () => {
    page++;
    loadProducts();
  });

  updateAuthUI();
  loadFilters();
  loadFavorites(true);
  loadProducts();
});