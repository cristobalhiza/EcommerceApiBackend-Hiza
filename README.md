# Proyecto Backend II - Cristobal Hiza - Coderhouse

Este es el proyecto de la **Primera Pre-Entrega** del curso de Backend II de Coderhouse. Se trata de una aplicación backend desarrollada con Node.js, Express y Passport, que incluye autenticación con usuarios locales y GitHub, junto con un sistema de gestión de rutas y mecanismos de autenticación y autorización.

## Tecnologías Utilizadas

- **Node.js**
- **Express**
- **Mongoose (MongoDB)**
- **Passport**
- **JWT (JSON Web Tokens)**
- **Handlebars**
- **Fly.io (Despliegue en la nube)**

## Estructura del proyecto

```plaintext
├── .github
│   ├── workflows
│   │   ├── fly-deploy.yml
├── src
│   ├── config
│   │   ├── config.js
│   │   ├── passport.config.js
│   ├── dao
│   │   ├── models
│   │   │   ├── usuarios.model.js
│   │   ├── usuariosManager.js
│   ├── middleware
│   │   ├── auth.js
│   │   ├── checkAuth.js
│   ├── public
│   │   ├── css
│   │   │   ├── styles.css
│   │   ├── js
│   │   │   ├── login.js
│   │   │   ├── registro.js
│   ├── routes
│   │   ├── sessionsRouter.js
│   │   ├── viewsRouter.js
│   ├── views
│   │   ├── layouts
│   │   │   ├── main.handlebars
│   │   ├── partials
│   │   │   ├── menu.handlebars
│   │   ├── current.handlebars
│   │   ├── home.handlebars
│   │   ├── login.handlebars
│   │   ├── registro.handlebars
│   ├── app.js
│   ├── connDB.js
│   ├── utils.js
├── .dockerignore
├── .gitignore
├── Dockerfile
├── fly.toml
├── githubApi.txt
├── package.json
├── pnpm-lock.yaml
├── PROJECT_STRUCTURE.txt
├── README.md
````
## Uso de la Aplicación

### Rutas Locales

- **Registro de Usuarios Locales:**
  - **GET** `/registro`: Muestra la página de registro.
  - **POST** `/api/sessions/registro`: Crea una nueva cuenta de usuario.

- **Inicio de Sesión Local:**
  - **GET** `/login`: Muestra la página de login.
  - **POST** `/api/sessions/login`: Inicia sesión para usuarios locales.

- **Autenticación con GitHub:**
  - **GET** `/api/sessions/github`: Redirige a GitHub para autenticación.
  - **GET** `/api/sessions/github/callback`: Callback para manejar la autenticación.

- **Estado del Usuario Actual:**
  - **GET** `/current`: Página que muestra los datos del usuario autenticado.
  - **GET** `/api/sessions/current`: Verifica el estado de la sesión del usuario actual.

- **Cerrar Sesión:**
  - **GET** `/api/sessions/logout`: Cierra la sesión del usuario.

### Despliegue en Fly.io

El proyecto está desplegado en [Fly.io](https://fly.io), y puedes acceder a la aplicación en: [https://proyectobackend2-hiza.fly.dev/](https://proyectobackend2-hiza.fly.dev/).
