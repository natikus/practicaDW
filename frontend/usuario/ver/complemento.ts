import {
  getGoogleCalendar,
  getGoogleContacts,
  getGoogleDrive,
} from "../../importante/metodos.js";

interface Calendar {
  summary: string;
}

interface Contact {
  names: { displayName: string }[];
  emailAddresses: { value: string }[];
}

interface DriveFile {
  name: string;
}
// Función para obtener datos del usuario desde el local storage
function getUserDataFromURL() {
  // Proporciona un valor predeterminado si getItem devuelve null
  const picture = localStorage.getItem("picture") || "";
  const locale = localStorage.getItem("locale") || "";
  const email = localStorage.getItem("email") || "";
  const nombre = localStorage.getItem("given_name") || "";
  const apellido = localStorage.getItem("family_name") || "";

  return { email, nombre, apellido, locale, picture };
}
// Mostrar la información del usuario en la página
const userData = getUserDataFromURL();

// Hacemos cast a los elementos correctos
// Hacemos cast a los elementos correctos
const userPicture = document.getElementById("userPicture") as HTMLImageElement;
const userName = document.getElementById("userName");
const userLastName = document.getElementById("userLastName");
const userEmail = document.getElementById("userEmail");
const userLocale = document.getElementById("userLocale");

// Verificamos si los elementos existen antes de intentar modificarlos
if (userPicture) {
  userPicture.src = userData.picture;
}

if (userName) {
  userName.textContent = userData.nombre;
}

if (userLastName) {
  userLastName.textContent = userData.apellido;
}

if (userEmail) {
  userEmail.textContent = userData.email;
}

if (userLocale) {
  userLocale.textContent = userData.locale;
}

async function mostrarCalendarios() {
  const calendars = await getGoogleCalendar();
  const calendarioContainer = document.getElementById("calendarioContainer");

  if (calendarioContainer) {
    calendarioContainer.innerHTML = ""; // Limpia el contenedor antes de mostrar nuevos datos

    calendars.forEach((calendario) => {
      const div = document.createElement("div");
      div.className = "calendario";
      div.innerHTML = `<h3>${calendario.summary}</h3>`;
      calendarioContainer.appendChild(div);
    });
  }
}

async function mostrarContactos() {
  const contactos = await getGoogleContacts();
  const contactosContainer = document.getElementById("contactosContainer");

  if (contactosContainer) {
    contactosContainer.innerHTML = ""; // Limpia el contenedor antes de mostrar nuevos datos

    contactos.forEach((contacto) => {
      const div = document.createElement("div");
      div.className = "contacto";
      const nombre = contacto.names[0]?.displayName || "Sin nombre";
      const email = contacto.emailAddresses[0]?.value || "Sin email";
      div.innerHTML = `<p>${nombre} - ${email}</p>`;
      contactosContainer.appendChild(div);
    });
  }
}

async function mostrarArchivosDrive() {
  const archivos = await getGoogleDrive();
  const driveContainer = document.getElementById("driveContainer");

  if (driveContainer) {
    driveContainer.innerHTML = ""; // Limpia el contenedor antes de mostrar nuevos datos

    archivos.forEach((archivo) => {
      const div = document.createElement("div");
      div.className = "archivo";
      div.innerHTML = `<p>${archivo.name}</p>`;
      driveContainer.appendChild(div);
    });
  }
}

// Llama a las funciones para mostrar los calendarios, contactos y archivos
mostrarCalendarios();
mostrarContactos();
mostrarArchivosDrive();
