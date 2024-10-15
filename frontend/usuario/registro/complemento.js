import { validacionesFormulario } from "../../importante/validaciones.js";
import { createPersona } from "../../importante/metodos.js";
function getUserDataFromURL() {
  const urlParams = new URLSearchParams(window.location.search);

  const email = urlParams.get("email");
  if (!email) {
    console.error("No se han encontrado los datos esperados en la URL");
    return null;
  }

  return { email };
}

function robarInfo() {
  const urlParams = new URLSearchParams(window.location.search);
  const given_name = urlParams.get("given_name");
  const email = urlParams.get("email");
  const family_name = urlParams.get("family_name");
  const picture = urlParams.get("picture");
  const locale = urlParams.get("locale");
  localStorage.setItem("given_name", given_name);
  localStorage.setItem("email", email);
  localStorage.setItem("family_name", family_name);
  localStorage.setItem("picture", picture);
  localStorage.setItem("locale", locale);
  console.log(localStorage);
}

window.addEventListener("DOMContentLoaded", () => {
  const userData = getUserDataFromURL();
  robarInfo();
  if (!userData) {
    console.error("No valid user data found");
    return;
  }
  email.value = userData.email || "";
});

document
  .getElementById("validateBtn")
  .addEventListener("click", async function () {
    const contrasena = document.getElementById("contrasena");
    const email = document.getElementById("email");

    const errorElements = document.querySelectorAll(".error");
    errorElements.forEach((el) => (el.style.display = "none"));

    let isValid = validacionesFormulario();

    if (isValid) {
      try {
        const formData = new FormData();
        formData.append("email", email.value);
        formData.append("contrasena", contrasena.value);

        const responseAlta = await createPersona(formData);
        console.log(responseAlta);
      } catch (error) {
        console.error("Error al registrar la persona:", error);
        alert("Error al registrar la persona");
      }
    }
  });
