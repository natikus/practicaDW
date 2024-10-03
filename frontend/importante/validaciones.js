export function validacionesFormulario() {
    const nombre = document.getElementById('nombre');
    const nombre2 = document.getElementById('nombre2');
    const apellido = document.getElementById('apellido');
    const contrasena = document.getElementById('contrasena');
    const confirmContrasena = document.getElementById('confirmContrasena');
    const email = document.getElementById('email');
    const cedula = document.getElementById('cedula');
    const rut = document.getElementById('rut');
    const imagen = document.getElementById('imagen');

    const nombreError = document.getElementById('nombreError');
    const nombre2Error = document.getElementById('nombre2Error');
    const apellidoError = document.getElementById('apellidoError');
    const contrasenaError = document.getElementById('contrasenaError');
    const confirmContrasenaError = document.getElementById('confirmContrasenaError');
    const emailError = document.getElementById('emailError');
    const cedulaError = document.getElementById('cedulaError');
    const rutError = document.getElementById('rutError');
    const imagenError = document.getElementById('imagenError');

    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(el => el.style.display = 'none');

    let isValid = true;




    if (nombre.value.trim() === '' || nombre.value.length < 2 || nombre.value.length > 50) {
        nombreError.textContent = 'El nombre es obligatorio y debe tener entre 2 y 50 caracteres.';
        nombreError.style.display = 'block';
        isValid = false;
    }

    if (nombre2.value.trim() !== '' && (nombre2.value.length < 2 || nombre2.value.length > 50)) {
        nombre2Error.textContent = 'El segundo nombre debe tener entre 2 y 50 caracteres si se ingresa.';
        nombre2Error.style.display = 'block';
        isValid = false;
    }


    if (apellido.value.trim() === '' || apellido.value.length < 2 || apellido.value.length > 50) {
        apellidoError.textContent = 'El apellido es obligatorio y debe tener entre 2 y 50 caracteres.';
        apellidoError.style.display = 'block';
        isValid = false;
    }


    if (contrasena.value.trim() === '' || contrasena.value.length < 6 || !/[A-Z]/.test(contrasena.value) || !/[a-z]/.test(contrasena.value) || !/[0-9]/.test(contrasena.value) || !/[!@#$%^&*_-]/.test(contrasena.value)) {
        contrasenaError.textContent = 'La contraseña debe tener al menos 6 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial.';
        contrasenaError.style.display = 'block';
        isValid = false;
    }

    if (confirmContrasena.value !== contrasena.value) {
        confirmContrasenaError.textContent = 'Las contraseñas no coinciden.';
        confirmContrasenaError.style.display = 'block';
        isValid = false;
    }


    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (email.value.trim() === '' || !emailPattern.test(email.value)) {
        emailError.textContent = 'El correo electrónico es obligatorio y debe ser válido.';
        emailError.style.display = 'block';
        isValid = false;
    }


    const cedulaPattern = /^\d{1}\.\d{3}\.\d{3}-\d{1}$/;
    if (cedula.value.trim() === '' || !cedulaPattern.test(cedula.value) || !validarCedulaUruguaya(cedula.value)) {
        cedulaError.textContent = 'La cédula es obligatoria, debe seguir el formato y ser válida.';
        cedulaError.style.display = 'block';
        isValid = false;
    }


    if (rut.value.trim() === '' || !validarRutUruguayo(rut.value)) {
        rutError.textContent = 'El RUT es obligatorio y debe ser válido.';
        rutError.style.display = 'block';
        isValid = false;
    }


    return isValid;
}




function validarCedulaUruguaya(cedula) {

    // Eliminar puntos y guiones
    cedula = cedula.replace(/\./g, '').replace(/-/g, '');

    // La cédula debe tener 7 u 8 dígitos (sin contar el dígito verificador)
    if (cedula.length < 7 || cedula.length > 8) {
        return false;
    }

    // Obtener el dígito verificador
    let digitoVerificador = parseInt(cedula.slice(-1));

    // Completar con ceros a la izquierda si la cédula tiene menos de 8 dígitos
    cedula = cedula.padStart(8, '0');

    // Constantes para el algoritmo de validación
    let coeficientes = [2, 9, 8, 7, 6, 3, 4];
    let suma = 0;

    // Calcular la suma ponderada de los primeros 7 dígitos
    for (let i = 0; i < 7; i++) {
        suma += parseInt(cedula[i]) * coeficientes[i];
    }

    // Calcular el módulo 10 de la suma
    let modulo = suma % 10;

    // Determinar el dígito verificador correcto
    let digitoCorrecto = modulo === 0 ? 0 : 10 - modulo;

    // Verificar si el dígito verificador es correcto
    return digitoCorrecto === digitoVerificador;
};
function verificadorRut(rut) {
    const pesos = [2, 9, 8, 7, 6, 3, 4];
    let suma = 0;

    // Convertir el RUT a un string para procesarlo dígito por dígito
    const rutStr = rut.toString();

    // Recorrer el RUT en sentido inverso (excepto el dígito verificador)
    for (let i = 0; i < rutStr.length; i++) {
        const digito = parseInt(rutStr.charAt(rutStr.length - 1 - i), 10);
        suma += digito * pesos[i];
    }

    // Calcular el módulo 11
    const modulo = suma % 11;
    const digitoVerificador = modulo === 0 ? 0 : modulo === 1 ? 'X' : 11 - modulo;

    return digitoVerificador;
}
function validarRutUruguayo(rut) {
    if (/^\d{12}$/.test(rut)) {
        return true;
    }
    console.log("El rut no cumple con el patron.")
    return false;
}

