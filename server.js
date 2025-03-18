const express = require('express'); // Import Express.js for the API
const mysql = require('mysql2/promise'); // Import promise-based MySQL for async/await
const cors = require('cors'); // Import CORS for cross-origin requests
const app = express(); // Create an Express app instance

app.use(cors()); // Allow frontend to access API from different origin
app.use(express.json()); // Parse JSON bodies from POST requests

/* Create a MySQL connection pool for better connection management */
const pool = mysql.createPool({
  host: 'localhost', // MySQL server (local machine)
  user: 'root', // MySQL username (replace if different)
  password: '01122001', // MySQL password (replace if different)
  database: 'books_db', // Target database
  waitForConnections: true, // Wait for a connection if all are in use
  connectionLimit: 10, // Max number of connections in pool
  queueLimit: 0 // Unlimited queued requests
});

/* Function to initialize database and table */
async function initializeDatabase() {
  let connection; // Variable to hold the connection
  try {
    connection = await pool.getConnection(); // Get a connection from the pool

    // Create database if it doesn’t exist
    await connection.query('CREATE DATABASE IF NOT EXISTS books_db');

    // Switch to the database
    await connection.query('USE books_db');

    // Create books table if it doesn’t exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each book
        title VARCHAR(255) NOT NULL -- Book title, cannot be null
      )
    `);

    // Insert initial data, skipping duplicates
    await connection.query(`
      INSERT IGNORE INTO books (id, title) VALUES 
        (1, 'Book One'), -- Sample book 1
        (2, 'Book Two')  -- Sample book 2
    `);

    console.log('Database and table set up successfully'); // Success message
  } catch (err) {
    console.error('Database setup failed:', err); // Log any errors
  } finally {
    if (connection) connection.release(); // Release connection back to pool
  }
}

/* GET endpoint to fetch all books */
app.get('/books', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM books'); // Fetch all books
    res.json(results); // Send results as JSON
  } catch (err) {
    console.error('Query error:', err); // Log error
    res.status(500).send('Server error'); // Send error response
  }
});

/* POST endpoint to add a new book */
app.post('/books', async (req, res) => {
  const { title } = req.body; // Extract title from request body
  try {
    await pool.query('INSERT INTO books (title) VALUES (?)', [title]); // Insert book
    res.send('Book added'); // Success message
  } catch (err) {
    console.error('Insert error:', err); // Log error
    res.status(500).send('Insert failed'); // Send error response
  }
});

/* Start server after database setup */
async function startServer() {
  await initializeDatabase(); // Wait for database setup to finish
  app.listen(3000, () => console.log('Server running on port 3000')); // Start server
}

startServer(); // Call the start function