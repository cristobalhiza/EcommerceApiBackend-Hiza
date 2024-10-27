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

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]{2,}(?:\.[a-zA-Z0-9-]+)*$/;
    if (!emailRegex.test(email)) {
        mostrarMensaje('Por favor, introduzca un email válido.');
        return;
    }

    const body = {
        email,
        password
    };

    try {

        const respuesta = await fetch('/api/sessions/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!respuesta.ok) {
            const errorData = await respuesta.text();
            console.error('Respuesta no válida:', errorData);
            mostrarMensaje('Ocurrió un error al procesar la solicitud. Verifique sus credenciales.');
            return;
        }

        const datos = await respuesta.json();

        if (datos.usuarioLogeado) {
            console.log(datos);
            window.location.href = '/current';
        } else {
            mostrarMensaje('Ocurrió un error al iniciar sesión. Inténtelo de nuevo.');
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