// ==============================
// userManager.js
// Gestiona la lista de usuarios con persistencia localStorage.
// ==============================

class UserManager {
    constructor() {
        const stored = localStorage.getItem('registeredUsers');
        this.users = stored ? JSON.parse(stored) : [];
    }

    // Verifica si un email ya existe
    emailExiste(email) {
        return this.users.some(user => user.email === email);
    }

    // Agrega usuario si no está duplicado
    agregarUsuario(userData) {
        if (this.emailExiste(userData.email)) {
            return { success: false, error: 'El correo electronico ya esta registrado.' };
        }

        const newUser = {
            id: Date.now(),
            fullName: userData.fullName,
            email: userData.email,
            age: userData.age || 'No especificada',
            interests: userData.interests || [],
            country: userData.country || 'No seleccionado'
        };

        this.users.unshift(newUser);
        this._guardarLocalStorage();
        return { success: true, error: null };
    }

    _guardarLocalStorage() {
        localStorage.setItem('registeredUsers', JSON.stringify(this.users));
    }

    obtenerUsuarios() {
        return [...this.users];
    }

    renderizarUsuarios() {
        if (this.users.length === 0) {
            return '<p class="empty-message">No hay usuarios registrados.</p>';
        }

        return this.users.map(user => `
      <div class="user-card">
        <p class="user-name">${this._escapeHtml(user.fullName)}</p>
        <p>Correo: ${this._escapeHtml(user.email)}</p>
        <p>Edad: ${this._escapeHtml(user.age)}</p>
        <p>Intereses: ${user.interests.length ? user.interests.map(this._escapeHtml).join(', ') : 'Ninguno'}</p>
        <p>Pais: ${this._escapeHtml(user.country)}</p>
      </div>
    `).join('');
    }

    _escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function (m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
}

export default UserManager;