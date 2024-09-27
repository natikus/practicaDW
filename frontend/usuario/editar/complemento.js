import { getPersonaById, updatePersona } from "../../importante/metodos.js";
import { validacionesFormulario } from "../../importante/validaciones.js";

// Recuperar el ID del usuario desde localStorage
const userId = localStorage.getItem('id');
const confirmBtn = document.getElementById("ConfirmBtn");

// Función para cargar los datos de la persona al cargar la página
async function loadPersona() {
    const persona = await getPersonaById(userId); // Usar la variable correcta

    if (!persona) {
        console.error('Persona no encontrada');
        alert('La persona no fue encontrada. No puedes realizar ninguna acción.');
        confirmBtn.disabled = true; // Deshabilitar el botón si no se encuentra la persona
    } else {
        // Rellenar los campos del formulario con los datos de la persona
        document.getElementById('nombre').value = persona.nombre;
        document.getElementById('nombre2').value = persona.nombre2 || '';
        document.getElementById('apellido').value = persona.apellido;
        document.getElementById('email').value = persona.email;
        document.getElementById('cedula').value = persona.cedula;
        document.getElementById('rut').value = persona.rut;

        confirmBtn.disabled = false; // Habilitar el botón si los datos se cargan correctamente
    }
}

// Cargar la persona cuando se cargue la página
loadPersona();

// Evento click en el botón de Confirmar
confirmBtn.addEventListener('click', async function (event) {
    event.preventDefault();  // Prevenir el envío del formulario y la redirección

    const nombre = document.getElementById('nombre');
    const nombre2 = document.getElementById('nombre2');
    const apellido = document.getElementById('apellido');
    const password = document.getElementById('password');
    const email = document.getElementById('email');
    const cedula = document.getElementById('cedula');
    const rut = document.getElementById('rut');

    // Resetear errores visibles (si los hay)
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(el => el.style.display = 'none');

    // Validar los datos del formulario
    let isValid = validacionesFormulario();

    if (isValid) {
        const personaData = {
            nombre: nombre.value,
            apellido: apellido.value,
            password: password.value,
            email: email.value,
            cedula: cedula.value,
            rut: rut.value
        };
        if (nombre2.value.trim() !== '') {
            nuevaPersona.nombre2 = nombre2.value;
        }

        // Llamar al método para actualizar la persona con los datos del formulario
        const updatedPersona = await updatePersona(userId, personaData); // Asegúrate de usar el ID correcto
        if (updatedPersona) {
            alert('Persona actualizada exitosamente');
            window.location.href = `./../../listado/verTodos/index.html`;
        }
    } else {
        console.error("No se han podido actualizar los datos");
    }
});
