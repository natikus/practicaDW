// Definir la URL base de tu API
const API_URL = "https://localhost/backend/personas";

// Función para crear una nueva persona (POST /persona)
export async function createPersona(formData) {
  try {
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Error al crear la persona");
    window.location.href = "../../usuario/login/index.html";
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function loginGoogle(user, token) {
  try {
    if (user && token) {
      localStorage.setItem("token", token);

      const googleUser = {
        name: user.get("username"),
        lastname: user.get("userlastname"),
      };
      localStorage.setItem("user", JSON.stringify(googleUser));
    } else {
      console.error("Login con google no disponible");
      //no se pq funciona pero tira esto, lo importante es que fundiona :)
    }
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
}
// Obtener datos de Google Calendar
export async function getGoogleCalendar() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const response = await fetch("https://localhost/backend/google/calendar", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const calendarData = await response.json(); // Datos de calendario
  console.log("Calendarios:", calendarData);
  return calendarData; // Devolver los datos
}

// Obtener datos de Google Contacts
export async function getGoogleContacts() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const response = await fetch("https://localhost/backend/google/contacts", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const contactsData = await response.json(); // Datos de contactos
  console.log("Contactos:", contactsData);
  return contactsData; // Devolver los datos
}

// Obtener datos de Google Drive
export async function getGoogleDrive() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const response = await fetch("https://localhost/backend/google/drive", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const driveFiles = await response.json(); // Archivos de Google Drive
  console.log("Archivos en Drive:", driveFiles);
  return driveFiles; // Devolver los datos
}
