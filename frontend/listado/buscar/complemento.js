
import { getAllPersonas } from "./../../importante/metodos.js";

async function getPerson(idPersona) {
    const cardContainer = document.getElementById("card-container");

    const personas = await getAllPersonas();
    if (!personas) return;

    personas.forEach(persona => {
        if ((persona.id).toString() === idPersona) {
            // Crear el contenedor de la tarjeta
            const card = document.createElement('div');
            card.classList.add('card');

            // Contenido de la tarjeta
            card.innerHTML = `
            <h2>${persona.nombre} ${persona.apellido}</h2>
            <p><strong>Cédula:</strong> ${persona.cedula}</p>
            <p><strong>RUT:</strong> ${persona.rut}</p>
            <p><strong>Correo:</strong> ${persona.email}</p>
            <button class="btnSee" data-id="${persona.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zm-8 4.5c-2.485 0-4.5-2.015-4.5-4.5S5.515 3.5 8 3.5 12.5 5.515 12.5 8 10.485 12.5 8 12.5z"/>
                    <path d="M8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
                </svg>
            </button>
        `;
            cardContainer.appendChild(card);
        }
    });

    // Añadir el evento a los botones después de que se han creado
    const buttons = document.querySelectorAll('.btnSee');
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            seePerson(id);
        });
    });
};

async function seePerson(id) {
    window.location.href = `./../ver/index.html?id=${id}`;
}

document.querySelectorAll('.btnsearch').forEach(button => {
    button.addEventListener('click', function () {
        const id = document.getElementById('searchPerson').value;
        getPerson(id);  // Llamada a la función async
    });
});