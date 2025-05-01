// import {Router} from 'express';
const usuarios =  require('./app/controllers/UsuariosController.js')
const enderecos = require('./app/controllers/EnderecosController.js')
const routes = require('express').Router();
const sessions = require('./app/controllers/SessionsController.js');
const authMiddleware = require('./app/middlewares/auth.js');

routes.post('/sessions', sessions.create);

routes.use(authMiddleware);

routes.get('/', (req, res) => {
    return res.json({ message: 'Index tá liberado patrão' });
});

routes.get('/usuarios', usuarios.index);
routes.get('/usuarios/:id', usuarios.show);
routes.post('/usuarios', usuarios.create);
routes.put('/usuarios/:id', usuarios.update);
routes.delete('/usuarios/:id', usuarios.delete);

// routes.get('/usuarios/enderecos', enderecos.index);
// routes.get('/usuarios/:usuarioId/enderecos/:id', enderecos.show);
// routes.post('/usuarios/:usuarioId/enderecos', enderecos.create);
// routes.put('/usuarios/:usuarioId/enderecos/:id', enderecos.update);
// routes.delete('/usuarios/:usuarioId/enderecos/:id', enderecos.delete);


routes.get('/enderecos', enderecos.index);
routes.get('/enderecos/:id', enderecos.show);
routes.post('/enderecos', enderecos.create);
routes.put('/enderecos/:id', enderecos.update);
routes.delete('/enderecos/:id', enderecos.delete);

module.exports = routes;
