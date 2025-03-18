# Books API

A simple RESTful API and frontend application for managing a books database. Built with Node.js, Express.js, MySQL, and a basic HTML/CSS/JavaScript frontend, it supports CRUD operations (Create, Read, Update, Delete) with role-based access (Viewer and Admin).

## Features
- **Viewer Role**: View the list of books.
- **Admin Role**: Add new books, delete existing books, and view the list.
- **Book Details**: Each book includes `title`, `author`, and `publication_year`.
- **Frontend**: A simple login page and books management interface styled with CSS.

## Project Structure
books-api/
├── frontend/
│   ├── index.html   # Frontend HTML with login and books display
│   └── styles.css   # CSS for styling the frontend
├── server.js        # Backend API with Express and MySQL
├── package.json     # Node.js dependencies and scripts
└── README.md        # This file


## Prerequisites
- **Node.js**: Version 14 or higher (download from [nodejs.org](https://nodejs.org)).
- **MySQL**: Installed and running (e.g., via XAMPP or MySQL Community Server).
- **Git**: Optional, for cloning the project if hosted.

## Setup Instructions

### 1. Clone or Download
- If this is in a repository: `git clone <repository-url>` or download the ZIP and extract it.
- Navigate to the project folder: `cd books-api`.

### 2. Install Dependencies
- Run `npm install` to install required packages (`express`, `mysql2`, `cors`).

### 3. Configure MySQL
- Start your MySQL server (e.g., `mysql.server start` on macOS or via XAMPP).
- Ensure a `root` user exists with no password (or update `server.js` with your credentials):
  ```javascript
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Replace if different
    password: '', // Replace if different
    database: 'books_db',
    // ... other options
  });

  Usage
Login:
On the login page, choose "Viewer" or "Admin" from the dropdown and click "Enter".
Viewer: Sees only the book list.
Admin: Sees the list plus options to add or delete books.
View Books:
Books are displayed as "Title by Author (Year)" (e.g., "Book One by Author A (2020)").
Add a Book (Admin Only):
Enter a title, author, and optional publication year in the input fields.
Click "Add Book" to save it to the database and refresh the list.
Delete a Book (Admin Only):
Click "Delete" next to a book to remove it and refresh the list.
API Endpoints
GET /books: Fetch all books ([{ id, title, author, publication_year }, ...]).
POST /books: Add a book (send { title, author, publication_year } in JSON).
DELETE /books/:id: Delete a book by ID.
