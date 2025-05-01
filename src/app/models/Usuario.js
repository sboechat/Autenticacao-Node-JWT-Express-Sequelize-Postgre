const {DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');

class Usuario extends Model {
    static init(sequelize) {
        super.init({
            nome: DataTypes.STRING,
            email: DataTypes.STRING,
            senha: DataTypes.STRING,
            dataNascimento: DataTypes.DATE,
            telefone: DataTypes.STRING,
            status: DataTypes.ENUM('ativo', 'inativo'),
        }, {
            sequelize,
            tableName: 'usuarios',
        });

        this.addHook('beforeSave', async (usuario) => {
            if (usuario.changed("senha")) {
                usuario.senha = await bcrypt.hash(usuario.senha, 8);
            }
        });
    }

    checkPassword(senha) {
        return bcrypt.compare(senha, this.senha);
    }

    static associate(models) {
        this.hasMany(models.Endereco, { foreignKey: 'usuario_id', as: 'enderecos' });
    }
}

module.exports = Usuario