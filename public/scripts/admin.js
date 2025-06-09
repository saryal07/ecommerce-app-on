document.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch('/api/admin/users', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!res.ok) return alert('Access denied');

  const users = await res.json();
  const container = document.getElementById('user-list');

  users.forEach(u => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h4>${u.username} (${u.email})</h4>
      <p>Favorites: ${u.favorites.map(f => f.name).join(', ')}</p>
      <hr>
    `;
    container.appendChild(div);
  });
});