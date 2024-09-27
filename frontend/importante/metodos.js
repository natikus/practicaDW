// Definir la URL base de tu API
const API_URL = "http://localhost/backend/personas"; // Asegúrate de ajustar esto según sea necesario

// Función para obtener todas las personas (GET /persona)
export async function getAllPersonas() {
    try {
        const response = await fetch(`${API_URL}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}` // Suponiendo que el JWT está almacenado en localStorage
            }
        });
        if (!response.ok) throw new Error("Error al obtener personas");
        return await response.json();  // Retorna la lista de personas
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Función para obtener una persona por ID (GET /persona/:id)
export async function getPersonaById(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        if (!response.ok) throw new Error("Error al obtener la persona");
        return await response.json();  // Retorna los datos de la persona
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Función para crear una nueva persona (POST /persona)
export async function createPersona(persona) {
    try {
        const response = await fetch(`${API_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(persona)
        });
        if (!response.ok) throw new Error("Error al crear la persona");
        return await response.json();  // Retorna la nueva persona creada
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Función para actualizar una persona por ID (PUT /persona/:id)
export async function updatePersona(id, personaData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(personaData)
        });

        if (!response.ok) throw new Error("Error al actualizar la persona");

        // Lee la respuesta una sola vez
        return await response.json(); // Retorna la persona actualizada
    } catch (error) {
        console.error(error);
        return null; // Retorna null en caso de error
    }
};


// Función para eliminar una persona por ID (DELETE /persona/:id)
export async function deletePersona(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        if (!response.ok) throw new Error("Error al eliminar la persona");
        return await response.json();  // Retorna el mensaje de confirmación
    } catch (error) {
        console.error(error);
        return null;
    }
}
export async function login(email, password) {
    try {
        const response = await fetch('http://localhost/backend/personas/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Datos del login:", data);
            // Guardar el token JWT en el almacenamiento local o en cookies
            localStorage.setItem('token', data.token);
            alert('Login exitoso');
            return {
                token: data.token,
                id: data.id,
                user: data.user,
            };
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Error en el login');
        }
    } catch (error) {
        console.error('Error al intentar hacer login:', error);
        alert('Error al intentar hacer login');
    }
};

