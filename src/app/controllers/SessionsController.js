const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario.js');
const authConfig = require('../../config/auth.js');
class SessionsController {

    async create(req, res) {
        const { email, senha } = req.body;
        const usuario = await Usuario.findOne({
            where: { email }
        });
        if (!usuario) {
            return res.status(401).json({ error: 'Email não cadastrado.' });
        }
        if (!(await usuario.checkPassword(senha))) {
            return res.status(401).json({ error: 'Senha incorreta.' });
        }

        return res.json({ 
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
            },
            token: jwt.sign({ id: usuario.id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });
    }
}

module.exports = new SessionsController();