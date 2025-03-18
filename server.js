const express = require('express'); // Import Express.js for API
const mysql = require('mysql2/promise'); // Import promise-based MySQL
const cors = require('cors'); // Import CORS for frontend access
const app = express(); // Create Express app

app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies

/* MySQL connection pool */
const pool = mysql.createPool({
  host: 'localhost', // Local MySQL server
  user: 'root', // Replace with your MySQL username
  password: '01122001', // Replace with your MySQL password
  database: 'books_db', // Target database
  waitForConnections: true, // Wait for connections
  connectionLimit: 10, // Max connections
  queueLimit: 0 // No queue limit
});

/* Initialize database with a richer schema */
async function initializeDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('CREATE DATABASE IF NOT EXISTS books_db'); // Create DB if needed
    await connection.query('USE books_db'); // Switch to database
    await connection.query('DROP TABLE IF EXISTS books'); // Reset table (remove if keeping data)
    await connection.query(`
      CREATE TABLE books (
        id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID
        title VARCHAR(255) NOT NULL, -- Book title, required
        author VARCHAR(255) NOT NULL, -- Author name, required
        publication_year INT -- Year published, optional
      )
    `);
    await connection.query(`
      INSERT IGNORE INTO books (id, title, author, publication_year) VALUES 
        (1, 'Book One', 'Author A', 2020),
        (2, 'Book Two', 'Author B', 2021)
    `); // Seed with sample data
    console.log('Database and table set up successfully');
  } catch (err) {
    console.error('Database setup failed:', err);
  } finally {
    if (connection) connection.release(); // Release connection
  }
}

/* GET /books: Fetch all books */
app.get('/books', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM books'); // Get all fields
    res.json(results); // Return as JSON
  } catch (err) {
    console.error('Query error:', err);
    res.status(500).send('Server error');
  }
});

/* POST /books: Add a new book with title, author, and publication_year */
app.post('/books', async (req, res) => {
  const { title, author, publication_year } = req.body; // Extract all fields
  if (!title || !author) return res.status(400).send('Title and author are required'); // Validate
  try {
    const [result] = await pool.query(
      'INSERT INTO books (title, author, publication_year) VALUES (?, ?, ?)',
      [title, author, publication_year || null] // Allow optional year
    );
    console.log(`Book added: ${title} by ${author}, ID: ${result.insertId}`); // Log success
    res.json({ id: result.insertId, title, author, publication_year }); // Return new book
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).send('Insert failed');
  }
});

/* DELETE /books/:id: Remove a book */
app.delete('/books/:id', async (req, res) => {
  const { id } = req.params; // Get ID from URL
  try {
    const [result] = await pool.query('DELETE FROM books WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).send('Book not found');
    console.log(`Book deleted: ID ${id}`);
    res.send('Book deleted');
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).send('Delete failed');
  }
});

/* Start server */
async function startServer() {
  await initializeDatabase(); // Wait for DB setup
  app.listen(3000, () => console.log('Server running on port 3000'));
}

startServer();
