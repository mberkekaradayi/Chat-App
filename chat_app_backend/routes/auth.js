// Authentications routes - login and register

const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// Register a user API
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  console.log({ "register credentials": req.body });
  try {
    // Check if the user already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "An account with that email alraedy exists." });
    }

    // Insert the new user into the database
    await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [
      email,
      password,
    ]);
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login a user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log({ "login credentials": req.body });

  try {
    // Check if the user exists
    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    res.status(200).json({ message: "Login successful.", user: user.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// return all registered users
router.get("/users", async (req, res) => {
  try {
    const users = await pool.query("SELECT id, email FROM users");
    res.status(200).json(users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// Save a new message
router.post("/messages", async (req, res) => {
  const { sender_email, recipient_email, content } = req.body;
  console.log({ message: req.body });

  try {
    const result = await pool.query(
      `INSERT INTO messages (sender_email, recipient_email, content) 
         VALUES ($1, $2, $3) RETURNING *`,
      [sender_email, recipient_email, content]
    );

    res.status(201).json(result.rows[0]); // Return the saved message
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error saving message" });
  }
});

// Fetch messages for a specific chat
router.get("/messages", async (req, res) => {
  const { sender_email, recipient_email } = req.query;
  console.log({ "fetch messages": req.query });

  try {
    // Fetch one-to-one chat messages using email
    const result = await pool.query(
      `SELECT * FROM messages 
         WHERE (sender_email = $1 AND recipient_email = $2) 
            OR (sender_email = $2 AND recipient_email = $1) 
         ORDER BY timestamp ASC`,
      [sender_email, recipient_email]
    );

    res.status(200).json(result.rows); // Return the fetched messages
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error fetching messages" });
  }
});

// Remove a message from a specific chat - Delete a message by ID
router.delete("/messages/:id", async (req, res) => {
  const { id } = req.params;
  console.log({ "delete message": req.params });

  try {
    const result = await pool.query(`DELETE FROM messages WHERE id = $1`, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error deleting message" });
  }
});

//
router.get("/unread-messages", async (req, res) => {
  const { user_email } = req.query;

  try {
    const unreadMessages = await pool.query(
      `SELECT sender_email, COUNT(*) as unread_count 
       FROM messages 
       WHERE recipient_email = $1 AND is_read = false 
       GROUP BY sender_email`,
      [user_email]
    );

    res.status(200).json(unreadMessages.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error fetching unread messages count" });
  }
});

router.put("/messages/mark-read", async (req, res) => {
  const { sender_email, recipient_email } = req.body;

  try {
    await pool.query(
      `UPDATE messages 
       SET is_read = true 
       WHERE sender_email = $1 AND recipient_email = $2 AND is_read = false`,
      [sender_email, recipient_email]
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error updating messages as read" });
  }
});

module.exports = router;
