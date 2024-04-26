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
    static async creategame({ userId, difficulty, number, solve }) {
      const game = await Game.create({
        userId,
        difficulty,
        number,
        solve
      });
      return await Game.scope('currentGame').findByPk(game.id)
    }
    static associate(models) {
      // define association here
      Game.belongsTo(models.User, { foreignKey: 'userId', as: 'Player' })
      Game.hasMany(models.Guess, {foreignKey: 'gameId'})
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
    },
    solve:{
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {
    sequelize,
    modelName: 'Game',
    defaultScope: {
      attributes: { exclude: ['updatedAt'] }
    },
    scopes: {
      currentGame: {
        attributes: { exclude: ['updatedAt'] }
      },
    }
  });
  return Game;
};
