const knex = require('knex');

const db = process.env.DB_ENV || 'development'; // Setup for deployment on heroku
const knexConfig = require('../knexfile.js')[db];

module.exports = knex(knexConfig);
