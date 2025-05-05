'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'tipo', {
      type: Sequelize.ENUM('admin', 'usuario'),
      allowNull: false,
      defaultValue: 'usuario',
    });
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('usuarios', 'tipo', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_usuarios_tipo";', { transaction });
    });
  }
};
