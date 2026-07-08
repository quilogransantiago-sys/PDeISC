// renderer.js - Renderiza usuarios con badge del método usado
const userList = document.getElementById('userList');

export function renderUsers(users, method = '') {
  if (!users?.length) {
    userList.innerHTML = '<p>No hay usuarios.</p>';
    return;
  }
  const badge = method ? `<span class="badge">${method}</span>` : '';
  userList.innerHTML = users.map(u => `
    <div class="user-card">
      <h3>${u.name} ${badge}</h3>
      <p>${u.email}</p>
    </div>
  `).join('');
}

export function showStatus(msg, isError = false) {
  const div = document.getElementById('statusMsg');
  if (!div) return;
  div.textContent = msg;
  div.className = 'status-message' + (isError ? ' error' : ' success');
}