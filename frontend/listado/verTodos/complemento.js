import { deletePersona, getAllPersonas } from "./../../importante/metodos.js";
import { loginGoogle } from "./../../importante/metodos.js";

const userId = localStorage.getItem('id');
console.log(userId);
document.addEventListener("DOMContentLoaded", async function () {
    const cardContainer = document.getElementById("card-container");
    console.log(localStorage);

    const personas = await getAllPersonas();
    if (!personas) return;

    personas.forEach(persona => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <h2>${persona.nombre} ${persona.apellido}</h2>
            <p><strong>Cédula:</strong> ${persona.cedula}</p>
            <p><strong>RUT:</strong> ${persona.rut}</p>
            <p><strong>Correo:</strong> ${persona.email}</p>
            <button class="btnSee" data-id="${persona.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zm-8 4.5c-2.485 0-4.5-2.015-4.5-4.5S5.515 3.5 8 3.5 12.5 5.515 12.5 8 10.485 12.5 8 12.5z"/>
                    <path d="M8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
                </svg>
            </button>
        `;
        cardContainer.appendChild(card);
    });

    const button = document.querySelectorAll('.btnSee');
    button.forEach(button => {
        button.addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            seePerson(id);
        });
    });

});

async function seePerson(id) {
    window.location.href = `./../../usuario/ver/index.html?id=${id}`;
}
document.getElementById('btnEliminarme').addEventListener('click', () => {
    eliminarme(userId);
});
async function eliminarme(id) {
    console.log("eliminando persona");
    const eliminar = await deletePersona(id);

    if (eliminar && eliminar.ok) {
        console.log("Has borrado tu perfil, hasta la próxima");
    } else {
        console.error("Error al eliminar el perfil");
    }
    localStorage.clear();
    window.location.href = `./../../usuario/login/index.html`;
}




document.getElementById('btnEditarme').addEventListener('click', () => {
    console.log("boton editarme apretado");

    if (!userId) {
        console.error("No se encontró userId en localStorage.");
        return;
    };


    window.location.href = `./../../usuario/editar/index.html?id=${userId}`;
});


document.getElementById('btnSalir').addEventListener('click', () => {

    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('userInfo');


    window.location.href = './../..';
});

async function GoogleLogin() {
    if (!localStorage.getItem('token')) {
        console.log("Verificando si hay datos de Google en la URL...");
        try {
            const { user, token } = await getGoogleInfo();
            if (user && token) {
                console.log("Datos de Google obtenidos:", { user, token });
                await loginGoogle({ user, token });
                window.alert('Login exitoso');
                document.dispatchEvent(new Event('authChanged'));
            } else {
                console.error('No se encontraron parámetros "user" o "token" en la URL');
            }
        } catch (error) {
            console.error('Login fallido:', error);
            window.alert('Login fallido: ' + error.message);
        }
    }
};

async function getGoogleInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get('user');
    const token = urlParams.get('token');
    console.log('Parámetros obtenidos:', { user, token });
    return { user, token };
}
window.addEventListener('load', () => {
    GoogleLogin();
});