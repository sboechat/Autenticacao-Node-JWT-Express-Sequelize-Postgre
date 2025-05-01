const Usuario = require('../models/Usuario')
const Endereco = require('../models/Endereco')
const Yup = require('yup')

class UsuariosController {
    async index(req, res) {
        const data = await Usuario.findAll({
            limit: 1000,
            include: {
                model: Endereco,
                as: 'enderecos',
                attributes: ['id', 'logradouro', 'numero', 'complemento', 'bairro', 'cidade', 'estado'],
                required: false,
            },
            attributes: { exclude: ['senha'] },
        })
        return res.json(data)
    }

    async show(req, res) {
        try {
            const usuario = await Usuario.findByPk(req.params.id, {
                include: {
                    model: Endereco,
                    as: 'enderecos',
                    attributes: ['id', 'logradouro', 'numero', 'complemento', 'bairro', 'cidade', 'estado'],
                    required: false,
                },
                attributes: { exclude: ['senha'] },
            })

            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não encontrado' })
            }
            return res.status(200).json(usuario)
        } catch (err) {
            console.log(err)
        }
    }

    async create(req, res) {

        const schema = Yup.object().shape({
            nome: Yup.string().required('Nome é obrigatório'),
            email: Yup.string().email('Email inválido').required('Email é obrigatório'),
            dataNascimento: Yup.date().required('Data de nascimento é obrigatória'),
            telefone: Yup.string().required('Telefone é obrigatório'),
            status: Yup.string("Status inválido").oneOf(['ativo', 'inativo']),
            senha: Yup.string().required('Senha é obrigatória').min(6, 'Senha deve ter no mínimo 6 caracteres'),
            senhaConfirmacao: Yup.string().min(6, 'Senha deve ter no mínimo 6 caracteres').required('Confirmação de senha é obrigatória').oneOf([Yup.ref('senha')], 'Senhas não conferem'),
        })
        try {
            await schema.validate(req.body);
            try {
                const usuario = await Usuario.create(req.body)
                return res.status(201).json(usuario)
            } catch (err) {
                if (err.name === 'SequelizeUniqueConstraintError') {
                    return res.status(400).json({ error: 'Dados já cadastrados.' });
                }
                return res.status(500).json({ error: 'Erro interno' });
            }
        } catch (err) {
            return res.status(400).json({ error: err.errors[0] });
        }
    }

    async update(req, res) {

        const schema = Yup.object().shape({
            nome: Yup.string("Nome inválido"),
            email: Yup.string().email('Email inválido'),
            senha: Yup.string("Senha inválida").min(6, 'Senha deve ter no mínimo 6 caracteres'),
            senhaConfirmacao: Yup.string("Confirmação de senha inválida")
                .min(6, 'Confirmação de senha deve ter no mínimo 6 caracteres')
                .when("senha", (senha, field) => {
                    return senha[0] ? field.required('Confirmação de senha é obrigatória').oneOf([Yup.ref('senha')], 'Senhas não conferem') : field
                }),
            senhaAntiga: Yup.string("Senha antiga inválida")
                .min(6, 'Senha antiga deve ter no mínimo 6 caracteres')
                .when("senha", (senha, field) => {
                    console.log(senha)
                   return senha[0] ? field.required('Senha antiga é obrigatória') : field
                }),

            dataNascimento: Yup.date("Data de nascimento inválida"),
            telefone: Yup.string("Telefone inválido"),
            status: Yup.string("Status inválido").oneOf(['ativo', 'inativo']),
        })

        try {
            await schema.validate(req.body);

            try {
                const usuario = await Usuario.findByPk(req.params.id)
                if (!usuario) {
                    return res.status(404).json({ error: 'Usuário não encontrado' })
                }

                const { senhaAntiga } = req.body
                if (senhaAntiga && !(await usuario.checkPassword(senhaAntiga))) {
                    return res.status(401).json({ error: 'Senha antiga não confere' })
                }
                await usuario.update(req.body)
                return res.status(200).json(usuario)

            } catch (err) {
                if (err.name === 'SequelizeUniqueConstraintError') {
                    return res.status(400).json({ error: 'Dados já cadastrados.' });
                }
                return res.status(500).json({ error: 'Erro interno' });
            }

        } catch (err) {
            return res.status(400).json({ error: err.errors[0] });
        }

    }

    async delete(req, res) {

        const usuario = await Usuario.findByPk(req.params.id)
        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' })
        }
        try {
            await usuario.destroy()
            return res.status(204).send()
        } catch (err) {
            return res.status(500).json({ error: 'Erro interno' });
        }
    }
}

module.exports = new UsuariosController()