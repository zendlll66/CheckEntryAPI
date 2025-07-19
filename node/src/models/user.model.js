const knex = require('../db/knex');

const User = {
  async findUserByEmailOrPhone(email,phone) {
    try {
      const users = await knex('users')
        .select('*')
        .where(function() {
          if (email) this.orWhere({ email:email });
          if (phone) this.orWhere({ phone:phone });
        });
      return users;
    } catch (error) {
      return [];
    }
    
  },

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
