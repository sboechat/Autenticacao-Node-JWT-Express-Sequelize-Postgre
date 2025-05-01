const { DataTypes, Model } = require('sequelize');
const Usuario = require('./Usuario');

class Endereco extends Model {
    static init(sequelize) {
        super.init({
            logradouro: DataTypes.STRING,
            numero: DataTypes.STRING,
            complemento: DataTypes.STRING,
            bairro: DataTypes.STRING,
            cidade: DataTypes.STRING,
            estado: DataTypes.STRING,
            cep: DataTypes.STRING,
            usuario_id: DataTypes.INTEGER,
        }, {
            sequelize,
            tableName: 'enderecos',
            name: {
                singular: 'endereco',
                plural: 'enderecos',
            }
        });
    }

    static associate(models) {
        this.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
    }
}
module.exports = Endereco;