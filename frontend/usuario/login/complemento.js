import { login } from "./../../importante/metodos.js";

// Asignar el evento al botón de login
document.getElementById('btnLogin').addEventListener('click', async function (event) {
    event.preventDefault();

    const email = document.getElementById('mail').value;
    const password = document.getElementById('password').value;

    try {
        const { token, id, user } = await login(email, password);
        // Guardar en localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('id', id);
        // Redirigir al usuario
        window.location.href = '../../listado/verTodos/index.html';
    } catch (error) {
        console.error('Error durante el login:', error);
        alert('Error al iniciar sesión. Verifique sus credenciales.');
    }
});
