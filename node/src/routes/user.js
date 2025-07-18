const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const auth = require('../middlewares/authMiddleware');

// GET /users - ดึงข้อมูล user ทั้งหมด
router.get('/', async (req, res) => {
  try {
    //const users = await knex('users').select('*');

    res.json([]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.post('/setfirebasetoken', async (req, res) =>  {
  
   try {

      const token = req.body.token;
      const phone = req.body.phone;
      const email = req.body.email;

      if (!email && !phone) {
          return res.status(401).json({ error: 'Invalid parameter.' });
      }

      const users = await knex('users')
        .select('*')
        .where(function() {
          if (email) this.orWhere({ email:email });
          if (phone) this.orWhere({ phone:phone });
        });

      if (users.length==0) {
          return res.status(401).json({ error: 'not found user.' });
      }

      const updatetoken = await knex('users').update(
        {
          firebase_token: token
        }
      ).where
      (
        {id: users[0]['id'] }
      );
      
      return res.status(200).json({ message : 'success'});
      
    } catch (err) {
      console.log(err);
      return res.status(401).json({ error: 'unsuccess.' });
    }
});

module.exports = router;
