const Sequelize = require('sequelize');
const config = require('../config/database.js');
const Usuario = require('../app/models/Usuario.js')
const Endereco = require('../app/models/Endereco.js')
const models = [Usuario, Endereco]

class Database {
    constructor() {
        this.connection = new Sequelize(config)
        this.init()
        this.associate()
    }
    init(){
        models.forEach(model => model.init(this.connection))
    }

    associate() {
        models.forEach(model => {
            if (model.associate) {
                model.associate(this.connection.models)
            }
        })
    }
}

module.exports = new Database();