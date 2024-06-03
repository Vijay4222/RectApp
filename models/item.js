'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Item.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    starting_price: DataTypes.DECIMAL,
    current_price: DataTypes.DECIMAL,
    image_url: DataTypes.STRING,
    end_time: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Item',
  });
  return Item;
};