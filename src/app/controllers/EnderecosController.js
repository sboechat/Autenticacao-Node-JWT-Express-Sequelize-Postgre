const Endereco = require('../models/Endereco')
const Usuario = require('../models/Usuario')
const Yup = require('yup')



// logradouro: DataTypes.STRING,
// numero: DataTypes.STRING,
// complemento: DataTypes.STRING,
// bairro: DataTypes.STRING,
// cidade: DataTypes.STRING,
// estado: DataTypes.STRING,
// cep: DataTypes.STRING,

class EnderecosController {

    async index(req, res) {
        const data = await Endereco.findAll({
            limit: 1000,
            include: {
                model: Usuario,
                as: 'usuario',
                attributes: ['id', 'nome', 'email', 'telefone'],
                required: true,
            },
        })
        return res.json(data)
    }

    async show(req, res) {
        const endereco = await Endereco.findByPk(req.params.id, {
            include: {
                model: Usuario,
                as: 'usuario',
                attributes: ['id', 'nome', 'email', 'telefone'],
                required: true,
            }
        })

        if (!endereco) {
            return res.status(404).json({ error: 'Endereço não encontrado' })
        }
        return res.status(200).json(endereco)
    }

    async create(req, res) {

        const schema = Yup.object().shape({
            logradouro: Yup.string().required('Logradouro é obrigatório'),
            numero: Yup.string().required('Número é obrigatório'),
            complemento: Yup.string("Complemento inválido"),
            bairro: Yup.string().required('Bairro é obrigatória'),
            cidade: Yup.string().required('Cidade é obrigatório'),
            estado: Yup.string().required('Estado é obrigatório'),
            cep: Yup.string().required('CEP é obrigatório'),
            usuario_id: Yup.number().required('Usuário é obrigatório').positive('Usuário inválido').integer('Usuário inválido'),
        })

        try {
            await schema.validate(req.body);
            try {
                const endereco = await Endereco.create(req.body)
                return res.status(201).json(endereco)
            } catch (err) {
                console.log(err)
                return res.status(500).json({ error: 'Erro interno' });
            }
        } catch (err) {
            return res.status(400).json({ error: err.errors[0] });
        }
    }

    async update(req, res) {

        const schema = Yup.object().shape({
            logradouro: Yup.string('Logradouro é obrigatório'),
            numero: Yup.string('Número é obrigatório'),
            complemento: Yup.string("Complemento inválido"),
            bairro: Yup.string('Bairro é obrigatória'),
            cidade: Yup.string('Cidade é obrigatório'),
            estado: Yup.string('Estado é obrigatório'),
            cep: Yup.string('CEP é obrigatório'),
        })

        try {
            await schema.validate(req.body);

            try {
                const endereco = await Endereco.findByPk(req.params.id)
                if (!endereco) {
                    return res.status(404).json({ error: 'Endereço não encontrado' })
                }
                await endereco.update(req.body)
                return res.status(200).json(endereco)

            } catch (err) {
                return res.status(500).json({ error: 'Erro interno' });
            }

        } catch (err) {
            return res.status(400).json({ error: err.errors[0] });
        }

    }

    async delete(req, res) {

        const endereco = await Endereco.findByPk(req.params.id)
        if (!endereco) {
            return res.status(404).json({ error: 'Endereço não encontrado' })
        }
        try {
            await endereco.destroy()
            return res.status(204).send()
        } catch (err) {
            return res.status(500).json({ error: 'Erro interno' });
        }
    }
}

module.exports = new EnderecosController()