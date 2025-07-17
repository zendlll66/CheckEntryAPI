const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const auth = require('../middlewares/authMiddleware');

// GET /users - ดึงข้อมูล user ทั้งหมด
router.get('/', async (req, res) => {
  try {
    const users = await knex('users').select('*');

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
