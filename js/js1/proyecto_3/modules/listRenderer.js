/**
 * listRenderer.js - Renderiza la lista de personas con nombre, email y nacionalidad.
 */

/**
 * Renderiza la lista de personas.
 * @param {Array} people - Lista de objetos persona.
 * @param {Function} onDelete - Callback para eliminar.
 */
export function renderList(people, onDelete) {
  const container = document.getElementById('people-list-container');
  if (!container) return;

  if (people.length === 0) {
    container.innerHTML = '<div class="empty-message">No hay personas registradas aún.</div>';
    return;
  }

  // Mostrar tarjetas con nombre, correo y nacionalidad
  const listHtml = `
    <div class="people-grid">
      ${people.map(person => `
        <div class="person-card" data-id="${person.id}">
          <div class="person-header">
            <span class="person-name">${escapeHtml(person.nombre)} ${escapeHtml(person.apellido)}</span>
            <button class="delete-btn" data-id="${person.id}">Eliminar</button>
          </div>
          <div class="person-details">
            <div class="detail-item">
              <span class="detail-label">Email:</span>
              <span class="detail-value">${escapeHtml(person.mail)}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Nacionalidad:</span>
              <span class="detail-value">${escapeHtml(person.nacionalidad)}</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  container.innerHTML = listHtml;

  // Asignar eventos a botones eliminar
  const deleteBtns = container.querySelectorAll('.delete-btn');
  deleteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.getAttribute('data-id'));
      if (onDelete && typeof onDelete === 'function') {
        onDelete(id);
      }
    });
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}