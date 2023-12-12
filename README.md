# MamMates Backend Service
Backend service of seller and buyer app of MamMates.

## Technology
    - Node.js (for Production)
    - Bun (for Development and package installer)
    - Nodemon (monitoring and hot reload)

## Tools/Framework
    - Express (web server)
    - Sequelize (ORM)
    - JWT (access token)
    - Firebase (account management)
    - Joi (request body validation)
    - ESLint for linting

## Storage
    - MySQL
    - Cloud SQL for MySQL
    - Cloud Storage

## Infrastructure
    - Google Cloud Platform

## Folder Structure
```
.
├── src/
│   ├── controllers/
│   │   ├── index.js
│   │   ├── auth_controller.js
│   │   └── ...
│   ├── dto/
│   │   ├── request/
│   │   │   ├── index.js
│   │   │   ├── auth_request.js
│   │   │   └── ...
│   │   └── response/
│   │       ├── index.js
│   │       ├── default_response.js
│   │       └── ...
│   ├── middlewares/
│   │   ├── index.js
│   │   └── jwt.js
│   ├── models/
│   │   ├── index.js
│   │   ├── create_master.js
│   │   ├── migrate.js
│   │   └── ...
│   ├── pkg/
│   │   ├── index.js
│   │   ├── orm.js
│   │   └── server.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── auth_route.js
│   │   └── ...
│   └── app.js
├── .env
├── .eslintrc.json
├── .gitignore
└── package.json
```

### Structure Explanation
    - `src` is the source of backend service
    - `app.js` on `src` is the entry point for the service
    - each components like `middlewares` or `controllers` have their own `index.js` as import/export module
    - create your own `.env` based on `.env.example` key provided

### How to Install
    1. Clone this repo, `cd` to the cloned repo and checkout to `dev`
        ```bash
        git clone https://github.com/MamMates/mammates-be.git
        cd mammates-be
        git checkout dev
        ```
    2. Install dependencies
        ```bash
        npm install
        ```
        or
        ```bash
        bun install
        ```
    3. Create MySQL database named `mammates`
    4. Update your .env
    5. Uncomment `await initialMigrate()` and it's module import on `src/app.js`
    6. Run for the first time
        ```bash
        npm dev
        ```
        or
        ```bash
        npm dev
        ```
    7. Recomment lines on 5th step

## Script Available
    - `start` to start service on production
    - `dev` to start service on development
    - `mon` to start nodemon (hot reload)
    - `lint` to start ESLint check


