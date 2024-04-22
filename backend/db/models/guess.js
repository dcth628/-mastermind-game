'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Guess extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Guess.belongsTo(models.Game, {foreignKey: 'gameId', as: 'Games'})
    }
  }
  Guess.init({
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correct: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    misplaced: {
      type: DataTypes.INTEGER,
      allowNull:false,
    },
    round: {
      type: DataTypes.INTEGER,
      allowNull:false,
    },
  }, {
    sequelize,
    modelName: 'Guess',
  });
  return Guess;
};