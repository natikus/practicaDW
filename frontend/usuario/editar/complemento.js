import { getPersonaById, updatePersona } from "../../importante/metodos.js";
import { validacionesFormulario } from "../../importante/validaciones.js";

const userId = localStorage.getItem('id');
const confirmBtn = document.getElementById("ConfirmBtn");

async function loadPersona() {
    const persona = await getPersonaById(userId);

    if (!persona) {
        console.error('Persona no encontrada');
        alert('La persona no fue encontrada. No puedes realizar ninguna acción.');
        confirmBtn.disabled = true;
    } else {

        document.getElementById('nombre').value = persona.nombre;
        document.getElementById('nombre2').value = persona.nombre2 || '';
        document.getElementById('apellido').value = persona.apellido;
        document.getElementById('email').value = persona.email;
        document.getElementById('cedula').value = persona.cedula;
        document.getElementById('rut').value = persona.rut;

        confirmBtn.disabled = false;
    }
}


loadPersona();

confirmBtn.addEventListener('click', async function (event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre');
    const nombre2 = document.getElementById('nombre2');
    const apellido = document.getElementById('apellido');
    const contrasena = document.getElementById('contrasena');
    const email = document.getElementById('email');
    const cedula = document.getElementById('cedula');
    const rut = document.getElementById('rut');


    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(el => el.style.display = 'none');
    let isValid = validacionesFormulario();

    if (isValid) {
        const personaData = {
            nombre: nombre.value,
            apellido: apellido.value,
            contrasena: contrasena.value,
            email: email.value,
            cedula: cedula.value,
            rut: rut.value
        };
        if (nombre2.value.trim() !== '') {
            nuevaPersona.nombre2 = nombre2.value;
        }


        const updatedPersona = await updatePersona(userId, personaData);
        if (updatedPersona) {

            alert('Persona actualizada exitosamente');
            window.location.href = `./../../listado/verTodos/index.html`;
        }
    } else {

        console.error("No se han podido actualizar los datos");
    }
});
