import { getPersonaById } from "../../importante/metodos.js"; // Asegúrate de que la ruta sea correcta

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const idPersona = getQueryParam('id');

if (idPersona) {
    getPerson(idPersona);
} else {
    console.error('ID de persona no proporcionado');
}

async function getPerson(idPersona) {
    try {
        console.log('Haciendo fetch a:', `https://localhost/backend/personas/${idPersona}`);
        const persona = await getPersonaById(idPersona); // Llama al método que definiste en metodos.js

        if (persona) {
            document.getElementById('nombre').innerText = persona.nombre;
            document.getElementById('nombre2').innerText = persona.nombre2;
            document.getElementById('apellido').innerText = persona.apellido;
            document.getElementById('email').innerText = persona.email;
            document.getElementById('cedula').innerText = persona.cedula;
            document.getElementById('rut').innerText = persona.rut;

            console.log('La persona se ha cargado correctamente:', persona);
        } else {
            console.error('Error al obtener los datos de la persona');
        }
    } catch (error) {
        console.error('Error al obtener los datos de la persona:', error);
        alert('Error al obtener los datos de la persona');
    }
}
