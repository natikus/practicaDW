import { login } from "./../../importante/metodos.js";

document.getElementById('btnLogin').addEventListener('click', async function (event) {
    event.preventDefault();

    console.log(localStorage);
    const email = document.getElementById('email').value;
    const password = document.getElementById('contrasena').value;

    try {
        const { token, id, user } = await login(email, password);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('id', id);
        console.log(token, user, id);
        window.location.href = '../../listado/verTodos/index.html';
    } catch (error) {
        console.error('Error durante el login:', error);
        alert('Error al iniciar sesión. Verifique sus credenciales.');
    }
});

