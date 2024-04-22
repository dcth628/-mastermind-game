'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Game.belongsTo(models.User, { foreignKey: 'userId', as: 'Owner' })
      Game.hasMany(models.Guess, {foreignKey: 'gameId', onDelete: "CASCADE", hooks: true})
    }
  }
  Game.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    difficulty:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    number:{
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Game',
  });
  return Game;
};
