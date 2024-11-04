// app.js

const baseUrl = "http://localhost/backend"; // Cambia esto a la URL de tu servidor
let accessToken = null;

// Redirige al usuario a la página de autenticación de Google
document.getElementById("login-button").addEventListener("click", () => {
  window.location.href = `${baseUrl}/auth/login/google`;
});

// Después de autenticarse, el usuario es redirigido con el token en la URL
window.addEventListener("load", () => {
  const urlParams = new URLSearchParams(window.location.search);
  accessToken = urlParams.get("token"); // Obtiene el token de la URL
  if (accessToken) {
    document.getElementById("output").innerText = "Inicio de sesión exitoso!";
  }
});

// Función para obtener y mostrar la información del usuario
document.getElementById("get-user-info").addEventListener("click", () => {
  if (!accessToken) return alert("Inicia sesión primero");

  fetch(`${baseUrl}/auth/userinfo`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("output").innerText = JSON.stringify(
        data,
        null,
        2
      );
    })
    .catch((error) => console.error("Error:", error));
});

// Función para obtener y mostrar los archivos de Google Drive
document.getElementById("get-drive-files").addEventListener("click", () => {
  if (!accessToken) return alert("Inicia sesión primero");

  fetch(`${baseUrl}/google/drive`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("output").innerText = JSON.stringify(
        data,
        null,
        2
      );
    })
    .catch((error) => console.error("Error:", error));
});

// Función para obtener y mostrar los eventos del calendario
document.getElementById("get-calendar-events").addEventListener("click", () => {
  if (!accessToken) return alert("Inicia sesión primero");

  fetch(`${baseUrl}/google/calendar`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("output").innerText = JSON.stringify(
        data,
        null,
        2
      );
    })
    .catch((error) => console.error("Error:", error));
});
