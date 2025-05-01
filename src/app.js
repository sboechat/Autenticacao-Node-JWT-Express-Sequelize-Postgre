const express = require('express');
const routes = require('./routes');
// const authMiddleware = require('./app/middlewares/auth.js');
const Database = require('./database/index.js');

class App {
    constructor() {
        this.server = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(express.json());
        this.server.use(express.urlencoded({ extended: true }));
        // this.server.use(authMiddleware);
    }

    routes() {
        this.server.use(routes);
    }
}

module.exports = new App().server;
