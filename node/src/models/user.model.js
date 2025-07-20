const knex = require('../db/knex');

const User = {

  //หา user ด้วย email หรือ phone และระบุว่าซ้ำที่อะไร
  async findUserByEmailOrPhone(email, phone) {
    try {
      const duplicates = {
        emailExists: false,
        phoneExists: false,
        users: []
      };

      // ตรวจสอบ email ที่ซ้ำ
      if (email) {
        const emailUser = await knex('users')
          .select('*')
          .where({ email: email })
          .first();

        if (emailUser) {
          duplicates.emailExists = true;
          duplicates.users.push(emailUser);
        }
      }

      // ตรวจสอบ phone ที่ซ้ำ
      if (phone) {
        const phoneUser = await knex('users')
          .select('*')
          .where({ phone: phone })
          .first();

        if (phoneUser) {
          duplicates.phoneExists = true;
          // ตรวจสอบว่าเป็นคนเดียวกันกับ email หรือไม่
          if (!duplicates.users.find(user => user.id === phoneUser.id)) {
            duplicates.users.push(phoneUser);
          }
        }
      }

      return duplicates;
    } catch (error) {
      return {
        emailExists: false,
        phoneExists: false,
        users: []
      };
    }
  },


  //หา user ด้วย id
  async findById(id) {
    return knex('users').where({ id }).first();
  },

  //หา user ด้วย phone
  async findUserByPhone(phone) {
    return knex('users').where({ phone }).first();
  },

  async create(userData) {
    return knex('users').insert(userData);
  },

  async findAll() {
    return knex('users').select('*');
  },


  //สร้าง user
  async createUser(email, phone, hashedPassword) {
    return knex('users')
      .insert({
        email: email || '',
        phone: phone,
        password_hash: hashedPassword,
      })
      .returning('*'); // จะได้ข้อมูลแถวใหม่กลับมา (Postgres)
  },

  async updateToken(phone, token) {
    return knex('users').where({ phone }).update({ firebase_token: token });
  }

};

module.exports = User;
