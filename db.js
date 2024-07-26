require('dotenv').config();
const { Pool } = require('pg');

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize database
const initDb = async () => {
  const createProfilesTableQuery = `
    CREATE TABLE IF NOT EXISTS profiles (
      username VARCHAR(255) PRIMARY KEY,
      links JSONB,
      public BOOLEAN DEFAULT true
    );
  `;

  try {
    await pool.query(createProfilesTableQuery);
    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Function to insert a new profile
const insertProfile = async (username, links) => {
  const query = 'INSERT INTO profiles (username, links) VALUES ($1, $2)';
  try {
    await pool.query(query, [username, JSON.stringify(links)]);
  } catch (error) {
    console.error('Error inserting profile:', error);
    throw error;
  }
};

// Function to update an existing profile
const updateProfile = async (username, links) => {
  const query = 'UPDATE profiles SET links = $1 WHERE username = $2';
  try {
    await pool.query(query, [JSON.stringify(links), username]);
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Function to set profile public
const setProfilePublic = async (username) => {
  const query = 'UPDATE profiles SET public = true WHERE username = $1';
  try {
    await pool.query(query, [username]);
  } catch (error) {
    console.error('Error setting profile public:', error);
    throw error;
  }
};

// Function to set profile private
const setProfilePrivate = async (username) => {
  const query = 'UPDATE profiles SET public = false WHERE username = $1';
  try {
    await pool.query(query, [username]);
  } catch (error) {
    console.error('Error setting profile private:', error);
    throw error;
  }
};

// Function to get profile by username
const getProfileByUsername = async (username) => {
  const query = 'SELECT * FROM profiles WHERE username = $1';
  try {
    const result = await pool.query(query, [username]);
    return result.rows[0];
  } catch (error) {
    console.error('Error getting profile by username:', error);
    throw error;
  }
};

module.exports = {
  initDb,
  insertProfile,
  updateProfile,
  setProfilePublic,
  setProfilePrivate,
  getProfileByUsername
};
