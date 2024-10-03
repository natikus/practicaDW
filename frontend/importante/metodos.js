// Definir la URL base de tu API
const API_URL = "https://localhost/backend/personas"; 

// Función para obtener todas las personas (GET /persona)
export async function getAllPersonas() {
    try {
        const response = await fetch(`${API_URL}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}` 
            }
        });
        if (!response.ok) throw new Error("Error al obtener personas");
        return await response.json();  
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
        return await response.json();  
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Función para crear una nueva persona (POST /persona)
export async function createPersona(formData) {
    try {
        const response = await fetch(`${API_URL}`, {
            method: "POST",
            body: formData,
        });
        if (!response.ok) throw new Error("Error al crear la persona");
        window.location.href = '../../usuario/login/index.html';
        return await response.json();

    } catch (error) {
        console.error(error);
        return null;
    }
};

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

       
        return await response.json(); 
    } catch (error) {
        console.error(error);
        return null; 
    }
};


export async function deletePersona(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!response.ok) {
            throw new Error("Error al eliminar la persona");
        }
        
        return response;  

    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function login(email, contrasena) {
    try {
        const response = await fetch('https://localhost/backend/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, contrasena }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Datos del login:", data);
          
            localStorage.setItem('token', data.token);
            localStorage.setItem('id', data.id);
            localStorage.setItem('data', data.data);
            console.log("id del metodo", data.id);
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

export async function loginGoogle(user, token) {
    try {

        if (user && token) {

            localStorage.setItem('token', token);
           
            const googleUser = { name: user.get('username'), lastname: user.get('userlastname') };
            localStorage.setItem('user', JSON.stringify(googleUser));
        } else {
       
            
            console.error('Login con google no disponible');
            //no se pq funciona pero tira esto, lo importante es que fundiona :)
        }
    } catch (error) {
        console.error('Google login error:', error);
        throw error;
    }
};
