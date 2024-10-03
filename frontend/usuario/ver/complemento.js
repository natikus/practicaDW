import { getPersonaById } from "../../importante/metodos.js";

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
        const persona = await getPersonaById(idPersona);

        if (persona) {
            console.log('Persona obtenida:', persona);
            document.getElementById('nombre').innerText = persona.nombre;
            document.getElementById('nombre2').innerText = persona.nombre2 || '';
            document.getElementById('apellido').innerText = persona.apellido;
            document.getElementById('email').innerText = persona.email;
            document.getElementById('cedula').innerText = persona.cedula;
            document.getElementById('rut').innerText = persona.rut;
            console.log(persona.imagen)

            if (persona.imagen && persona.imagen !== "undefined") {
                const imgElement = document.createElement('img');
                imgElement.src = `https://localhost/backend${persona.imagen}`;
                imgElement.alt = 'Foto de perfil';
                document.getElementById('fotoPerfil').appendChild(imgElement);
            } else {
                console.error('La imagen de la persona es undefined o no está presente');
            }

            console.log('La persona se ha cargado correctamente:', persona);
        } else {
            console.error('Error al obtener los datos de la persona');
        }
    } catch (error) {
        console.error('Error al obtener los datos de la persona:', error);
        alert('Error al obtener los datos de la persona');
    }
}

