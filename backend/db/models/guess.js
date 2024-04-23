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
    static async createguess({ gameId, number, location, digit, round, time}) {
      const guess = await Guess.create({
        gameId,
        number,
        location,
        digit,
        round,
        time
      });
      return await Guess.scope('defaultScope').findByPk(guess.id)
    }
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
    location: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    digit: {
      type: DataTypes.INTEGER,
      allowNull:false,
    },
    round: {
      type: DataTypes.INTEGER,
      allowNull:false,
    },
    time: {
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'Guess',
    defaultScope: {
      attributes: { exclude: ['updatedAt', 'createdAt'] }
    },
  });
  return Guess;
};
