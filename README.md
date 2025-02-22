# Proyecto Backend - Cristobal Hiza&#x20;

Se trata de una aplicación backend desarrollada con Node.js, Express y Passport, que incluye autenticación con usuarios locales y GitHub, junto con un sistema de gestión de rutas y mecanismos de autenticación y autorización. Permite administrar usuarios, productos, carritos de compra y generar tickets con la información de cada checkout que se realiza de un carrito. Documentada con Swagger en /api/docs/

## Uso de la Imagen en Docker Hub

### Descargar la Imagen desde Docker Hub

```sh
docker pull cristobalhiza/ecommerceapibackend-hiza:latest
```

### Ejecutar el Contenedor

```sh
docker run --env-file .env -p 8080:8080 -d cristobalhiza/ecommerceapibackend-hiza:latest
```

### Verificar que el Contenedor Está Corriendo

```sh
docker ps
```

### Acceder a la Aplicación en el Navegador

[http://localhost:8080/api/products](http://localhost:8080/api/products)

## Tecnologías Utilizadas

- **Node.js**
- **Express**
- **Mongoose (MongoDB)**
- **Passport**
- **JWT (JSON Web Tokens)**
- **Handlebars**
- **Winston**
- **Faker**
- **Swagger**
- Mocha-Chai-Supertest

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
    ├── docs
        ├── cart.doc.yaml
        ├── mocks.doc.yaml
        ├── products.doc.yaml
        ├── ticket.doc.yaml
        ├── users.doc.yaml
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
        ├── docSpec.util.js
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
├── test
    ├── supertest
        ├── auth.test.js
        ├── cart.test.js
        ├── fllow.test.js
    ├── products.test.js
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
