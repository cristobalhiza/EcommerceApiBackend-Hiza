const inputEmail = document.getElementById('email');
const inputPassword = document.getElementById('password');
const btnSubmit = document.getElementById('btnSubmit');
const divMensajes = document.getElementById('mensajes');

btnSubmit.addEventListener('click', async (e) => {
    e.preventDefault();

    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();

    if (!email || !password) {
        mostrarMensaje('Complete todos los campos obligatorios.');
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        mostrarMensaje('Por favor, introduzca un email válido.');
        return;
    }

    const body = {
        email,
        password
    };

    try {
        const respuesta = await fetch('/api/sessions/login', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });

        const datos = await respuesta.json();

        if (respuesta.status >= 400) {
            setTimeout(() => {
                mostrarMensaje(datos.error || 'Ocurrió un error al procesar la solicitud.');
            }, 3000)
        } else {
            console.log(datos)
            localStorage.setItem("token", datos.token)
            // window.location.href = `/current`;
        }
    } catch (error) {
        mostrarMensaje('Hubo un problema con la conexión. Por favor, inténtelo más tarde.');
        console.error('Error al hacer fetch:', error);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const mensaje = getQueryParam('mensaje');
    if (mensaje) {
        mostrarMensaje(mensaje);
    }
});

function mostrarMensaje(mensaje) {
    divMensajes.textContent = mensaje;
    setTimeout(() => {
        divMensajes.textContent = '';
    }, 6000);
}