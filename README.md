# Proyecto Node.js con Handlebars, MongoDB y WebSocket

Este es un proyecto basado en Node.js que utiliza Handlebars como motor de plantillas, MongoDB para la base de datos y WebSocket para la comunicación en tiempo real. El proyecto está diseñado para manejar carritos de compras y productos en una tienda online con funcionalidades avanzadas.

## Estructura del Proyecto
```├── README.md
└── src
    ├── app.js
    ├── config
    │   ├── handlebars.config.js
    │   ├── mongoose.config.js
    │   └── websocket.config.js
    ├── managers
    │   ├── CartManager.js
    │   ├── ProductManager.js
    │   └── errorManager.js
    ├── models
    │   ├── cart.model.js
    │   └── product.model.js
    ├── public
    │   └── js
    │       ├── products.js
    │       └── products.socket.js
    ├── routes
    │   ├── api
    │   │   ├── carts.routes.js
    │   │   └── products.routes.js
    │   ├── cart.routes.js
    │   ├── home.routes.js
    │   └── product.routes.js
    └── utils
        ├── converter.js
        ├── fileSystem.js
        ├── paths.js
        ├── random.js
        └── uploader.js
```

## Instalación
1. Clona este repositorio:
```bash
   git clone https://github.com/PatricioCapparelli/ProyectoFinal-backend.git
```

## Requerimientos

Para ejecutar el proyecto correctamente, asegúrate de cumplir con los siguientes requisitos de software:
```
    - Node.js v18.20.4
    - Mongo Shell v2.2.15
    - GIT v2.34.1
    - IDE - Visual Studio Code v1.92.0
```
