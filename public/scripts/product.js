const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

async function loadProduct() {
  const res = await fetch(`/api/products/details/${productId}`);
  const data = await res.json();

  if (!res.ok) return alert(data.error);

  const container = document.getElementById('product-detail');
  container.innerHTML = `
    <img src="${data.product.image}" alt="${data.product.name}">
    <h2>${data.product.name}</h2>
    <p>${data.product.brand} — ${data.product.type}</p>
    <p>$${data.product.price}</p>
    <button onclick="favoriteProduct('${data.product._id}')">❤️ Favorite</button>
  `;

  const relatedRes = await fetch(`/api/products?brand=${data.product.brand}`);
  const relatedData = await relatedRes.json();

  const related = document.getElementById('related-products');
  related.innerHTML = '';
  relatedData.products
    .filter(p => p._id !== productId)
    .forEach(p => {
      const div = document.createElement('div');
      div.innerHTML = `<a href="/product.html?id=${p._id}">${p.name}</a>`;
      related.appendChild(div);
    });
}

loadProduct();