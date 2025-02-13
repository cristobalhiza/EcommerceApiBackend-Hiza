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
```
## Uso de la Aplicación

### Rutas Frontend
# Las rutas de la API REST se encuentran descritas mediante la ruta "/api/docs"

GET	/	Renderiza la página de inicio.
GET	/registro	Renderiza la página de registro de usuarios.
GET	/login	Renderiza la página de inicio de sesión.
GET	/current	Renderiza la página del usuario autenticado. Requiere autenticación.
GET	/cart/:cid	Renderiza la vista del carrito de compras del usuario.
GET	/products	Renderiza la lista de productos con filtros y paginación.
GET	/products/:pid	Renderiza la vista de detalles de un producto específico.

### Detalles de las Rutas
## Inicio

    Ruta: /
    Descripción: Renderiza la página principal de la aplicación.
    Datos: No requiere datos adicionales.
    Ejemplo de uso: Un usuario accede a la web en https://misitio.com/.

## Registro

    Ruta: /registro
    Descripción: Muestra el formulario para registrar un nuevo usuario.
    Datos: No requiere autenticación.
    Ejemplo de uso: https://misitio.com/registro

## Inicio de Sesión

    Ruta: /login
    Descripción: Muestra el formulario de inicio de sesión.
    Datos: No requiere autenticación.
    Ejemplo de uso: https://misitio.com/login

## Perfil del Usuario

    Ruta: /current
    Descripción: Renderiza la página con la información del usuario autenticado.
    Requiere Autenticación: Sí
    Ejemplo de uso: https://misitio.com/current

## Carrito de Compras

    Ruta: /cart/:cid
    Descripción: Muestra los productos en el carrito de compras de un usuario.
    Requiere Autenticación: No
    Parámetros:
        cid: ID del carrito.
    Ejemplo de uso: https://misitio.com/cart/60d21b4667d0d8992e610c85

## Lista de Productos

    Ruta: /products
    Descripción: Muestra una lista de productos con filtros y paginación.
    Datos opcionales (query params):
        limit: Número de productos por página.
        page: Número de página.
        sort: Orden de los productos (asc o desc).
        query: Búsqueda por nombre del producto.
    Ejemplo de uso:
        https://misitio.com/products?limit=10&page=2
        https://misitio.com/products?query=auriculares&sort=desc

## Detalle de un Producto

    Ruta: /products/:pid
    Descripción: Muestra la página con la información detallada de un producto específico.
    Parámetros:
        pid: ID del producto.
    Ejemplo de uso: https://misitio.com/products/60d21b4667d0d8992e610c86

## Notas Adicionales

    Estas rutas están diseñadas para renderizar páginas HTML, no JSON.
    /current requiere autenticación mediante passportCall('current').
    Se pueden agregar más filtros a /products según necesidades futuras.
