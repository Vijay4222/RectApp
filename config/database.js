const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection to the MySQL database has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the MySQL database:', err);
    });

module.exports = sequelize;
