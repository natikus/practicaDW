export function validacionesFormulario() {
  const contrasena = document.getElementById("contrasena");
  const confirmContrasena = document.getElementById("confirmContrasena");
  const email = document.getElementById("email");

  const contrasenaError = document.getElementById("contrasenaError");
  const confirmContrasenaError = document.getElementById(
    "confirmContrasenaError"
  );
  const emailError = document.getElementById("emailError");

  const errorElements = document.querySelectorAll(".error");
  errorElements.forEach((el) => (el.style.display = "none"));

  let isValid = true;

  if (
    contrasena.value.trim() === "" ||
    contrasena.value.length < 6 ||
    !/[A-Z]/.test(contrasena.value) ||
    !/[a-z]/.test(contrasena.value) ||
    !/[0-9]/.test(contrasena.value) ||
    !/[!@#$%^&*_-]/.test(contrasena.value)
  ) {
    contrasenaError.textContent =
      "La contraseña debe tener al menos 6 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial.";
    contrasenaError.style.display = "block";
    isValid = false;
  }

  if (confirmContrasena.value !== contrasena.value) {
    confirmContrasenaError.textContent = "Las contraseñas no coinciden.";
    confirmContrasenaError.style.display = "block";
    isValid = false;
  }

  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (email.value.trim() === "" || !emailPattern.test(email.value)) {
    emailError.textContent =
      "El correo electrónico es obligatorio y debe ser válido.";
    emailError.style.display = "block";
    isValid = false;
  }

  return isValid;
}
