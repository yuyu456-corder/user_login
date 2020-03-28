'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    //パスワードのカラムを追加
    return queryInterface.addColumn('users', 'password',
      {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
        unique:"true",
        // after and before option is only supported by MySQL
        after: "name"
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'password')
  }
};
