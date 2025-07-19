require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'checkentry',
    },
    pool: { min: 0, max: 7 },
    migrations: {
      directory: './migrations',  // ถ้าทำ migration
    },
    seeds: {
      directory: './seeds',       // ถ้าทำ seed
    },
  },

  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'checkentry',
    },
    pool: { min: 0, max: 7 },
    migrations: {
      directory: './migrations',  // ถ้าทำ migration
    },
    seeds: {
      directory: './seeds',       // ถ้าทำ seed
    },
  },

  test: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'checkentry',
    },
    pool: { min: 0, max: 7 },
    migrations: {
      directory: './migrations',  // ถ้าทำ migration
    },
    seeds: {
      directory: './seeds',       // ถ้าทำ seed
    },
  },
};
