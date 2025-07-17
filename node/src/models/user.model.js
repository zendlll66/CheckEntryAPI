const knex = require('../db/knex');

const User = {
  async findById(id) {
    return knex('users').where({ id }).first();
  },

  async create(userData) {
    return knex('users').insert(userData);
  },

  async findAll() {
    return knex('users').select('*');
  },

};

module.exports = User;
