// Google Client ID
const clientId =
  "436453147626-n2eojf3qa92ne5drk8hnf8f7nvu14csf.apps.googleusercontent.com";

// Inicializar Google Identity Services (GIS)
function handleCredentialResponse(response) {
  console.log("Encoded JWT ID token: " + response.credential);
  getUserInfo(response.credential);
}

function getUserInfo(idToken) {
  fetch("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + idToken)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("user-info").style.display = "block";
      document.getElementById("user-name").textContent = data.name;
      document.getElementById("user-email").textContent = data.email;

      // Inicializar gapi.client y cargar APIs de Drive y Calendar
      gapi.load("client", () => {
        gapi.client
          .init({
            apiKey: "<YOUR_API_KEY>", // Reemplaza <YOUR_API_KEY> con tu API Key
            discoveryDocs: [
              "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
              "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
            ],
          })
          .then(() => {
            // Cargar datos de Google Drive y Google Calendar
            loadDriveFiles(idToken);
            loadCalendarEvents(idToken);
          })
          .catch((error) =>
            console.error("Error al inicializar gapi.client:", error)
          );
      });
    })
    .catch((error) =>
      console.error("Error al obtener la información del usuario:", error)
    );
}

function loadDriveFiles(idToken) {
  gapi.client.drive.files
    .list({
      pageSize: 10,
      fields: "files(id, name)",
      access_token: idToken, // Añadir el token como parámetro en cada solicitud
    })
    .then((response) => {
      const files = response.result.files;
      const driveFilesList = document.getElementById("drive-files");
      driveFilesList.innerHTML = "";
      files.forEach((file) => {
        const listItem = document.createElement("li");
        listItem.textContent = file.name;
        driveFilesList.appendChild(listItem);
      });
    })
    .catch((error) =>
      console.error("Error al cargar archivos de Drive:", error)
    );
}

function loadCalendarEvents(idToken) {
  gapi.client.calendar.events
    .list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
      access_token: idToken, // Añadir el token como parámetro en cada solicitud
    })
    .then((response) => {
      const events = response.result.items;
      const calendarEventsList = document.getElementById("calendar-events");
      calendarEventsList.innerHTML = "";
      events.forEach((event) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${event.summary} - ${
          event.start.dateTime || event.start.date
        }`;
        calendarEventsList.appendChild(listItem);
      });
    })
    .catch((error) =>
      console.error("Error al cargar eventos del calendario:", error)
    );
}

// Cargar Google Identity Services al iniciar la aplicación
window.onload = function () {
  google.accounts.id.initialize({
    client_id: clientId,
    callback: handleCredentialResponse,
  });
  google.accounts.id.renderButton(
    document.getElementById("login-btn"),
    { theme: "outline", size: "large" } // Personaliza el botón
  );
  google.accounts.id.prompt(); // Opcional: muestra el prompt de One Tap
};
