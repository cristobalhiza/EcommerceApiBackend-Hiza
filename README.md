# Proyecto Backend - Cristobal Hiza - Coderhouse

Este es mi proyecto del curso de Backend de Coderhouse. Se trata de una aplicación backend desarrollada con Node.js, Express y Passport, que incluye autenticación con usuarios locales y GitHub, junto con un sistema de gestión de rutas y mecanismos de autenticación y autorización. Permite administrar usuarios, productos, carritos de compra y generar tickets con la información de cada checkout que se realiza de un carrito.

## Uso de la Imagen en Docker Hub
### Descargar la Imagen desde Docker Hub

docker pull cristobalhiza/ecommerceapibackend-hiza:latest

### Ejecutar el Contenedor

docker run --env-file .env -p 8080:8080 -d cristobalhiza/ecommerceapibackend-hiza:latest

### Verificar que el Contenedor Está Corriendo

docker ps

### Acceder a la Aplicación en el Navegador

http://localhost:8080/api/products

## Tecnologías Utilizadas

- **Node.js**
- **Express**
- **Mongoose (MongoDB)**
- **Passport**
- **JWT (JSON Web Tokens)**
- **Handlebars**
- **Winston**
- **Faker**

## Estructura del proyecto

```plaintext
├── .github
├── src
    ├── config
        ├── config.js
        ├── passport.config.js
    ├── controllers
        ├── CartController.js
        ├── MocksController.js
        ├── ProductsController.js
        ├── SessionsController.js
        ├── ViewsController.js
    ├── dao
        ├── models
            ├── cart.model.js
            ├── product.model.js
            ├── ticketModel.js
            ├── user.model.js
        ├── cartManager.js
        ├── productManager.js
        ├── userManager.js
    ├── DTO
        ├── UsersDTO.js
    ├── middleware
        ├── auth.js
        ├── errorHandler.js
        ├── httpLogger.mid.js
    ├── public
        ├── css
            ├── styles.css
        ├── js
            ├── login.js
            ├── main.js
            ├── registro.js
    ├── routes
        ├── apiCarts.router.js
        ├── apiProducts.router.js
        ├── mocks.router.js
        ├── sessions.router.js
        ├── views.router.js
    ├── services
        ├── Cart.service.js
        ├── Product.service.js
        ├── User.service.js
    ├── utils
        ├── errors
            ├── error.log
        ├── logger.util.js
        ├── mocks.utils.js
        ├── utils.js
    ├── views
        ├── layouts
            ├── main.handlebars
        ├── partials
            ├── menu.handlebars
        ├── current.handlebars
        ├── home.handlebars
        ├── login.handlebars
        ├── registro.handlebars
    ├── app.js
    ├── connDB.js
    ├── seed.js
    ├── server.js
├── .babelrc
├── .dockerignore
├── .env
├── .gitignore
├── Dockerfile
├── githubApi.txt
├── jest.config.js
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

- **Generar Mocks**
  - **GET** `/api/mocks/:users/:products`: Crea la cantidad seleccionada de mocks de usuarios o productos a elección.
