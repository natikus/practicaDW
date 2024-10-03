import { validacionesFormulario } from "../../importante/validaciones.js";
import { createPersona } from "../../importante/metodos.js";
function getUserDataFromURL() {

    const urlParams = new URLSearchParams(window.location.search);


    const email = urlParams.get('email');
    const nombre = urlParams.get('given_name');
    const apellido = urlParams.get('family_name');
    if (!email || !nombre || !apellido) {
        console.error('No se han encontrado los datos esperados en la URL');
        return null;
    }


    return { email, nombre: nombre, apellido };
}

window.addEventListener('DOMContentLoaded', () => {


    const userData = getUserDataFromURL();

    if (!userData) {
        console.error('No valid user data found');
        return;
    }

    nombre.value = userData.nombre || '';
    email.value = userData.email || '';

    if (!apellido.value === "undefined") {
        apellido.value = userData.apellido || '';
    } else {
        console.log("Tu cuenta no tiene un apellido registrado")
    }

});

document.getElementById('validateBtn').addEventListener('click', async function () {

    const nombre = document.getElementById('nombre').value + " " + document.getElementById('nombre2').value;

    const apellido = document.getElementById('apellido');
    const contrasena = document.getElementById('contrasena');
    const email = document.getElementById('email');
    const cedula = document.getElementById('cedula');
    const rut = document.getElementById('rut');
    const imagen = document.getElementById('imagen');

    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(el => el.style.display = 'none');

    let isValid = validacionesFormulario();

    if (isValid) {
        try {
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('apellido', apellido.value);
            formData.append('email', email.value);
            formData.append('contrasena', contrasena.value);
            formData.append('cedula', cedula.value);
            formData.append('rut', rut.value);

            if (imagen.files.length > 0) {
                formData.append('imagen', imagen.files[0]);
            }

            if (nombre2.value.trim() !== '') {
                formData.append('nombre2', nombre2.value);
            }

            const responseAlta = await createPersona(formData);
            console.log(responseAlta);
        } catch (error) {
            console.error('Error al registrar la persona:', error);
            alert('Error al registrar la persona');
        }
    }
});

