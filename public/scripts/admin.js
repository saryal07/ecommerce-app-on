document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('You must be logged in as admin');
    return window.location.href = '/login.html';
  }

  try {
    const res = await fetch('/api/admin/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const container = document.getElementById('user-list');
    container.innerHTML = ''; // clear loading message

    if (!res.ok) {
      if (res.status === 403) {
        alert('Access denied: Admins only');
        return window.location.href = '/';
      } else {
        throw new Error('Failed to fetch users');
      }
    }

    const users = await res.json();

    if (users.length === 0) {
      container.textContent = 'No users found.';
      return;
    }

    users.forEach(user => {
      const div = document.createElement('div');
      div.innerHTML = `
        <h4>${user.username} (${user.email})</h4>
        <p>Favorites: ${user.favorites.length > 0 
          ? user.favorites.map(f => f.name).join(', ') 
          : 'None'}</p>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    alert('Error loading users: ' + error.message);
    console.error(error);
  }
});

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = '/login.html';
});