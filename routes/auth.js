const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');

// GET /auth/login
router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/assess');
  res.render('login');
});

// GET /auth/register
router.get('/register', (req, res) => {
  if (req.session.user) return res.redirect('/assess');
  res.render('register');
});

// POST /auth/register
router.post('/register', async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password || password.length < 8) {
    req.flash('error', 'Please fill all fields. Password must be at least 8 characters.');
    return res.redirect('/auth/register');
  }

  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      req.flash('error', 'An account with this email already exists.');
      return res.redirect('/auth/register');
    }

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
      [first_name, last_name, email, hashed]
    );

    req.session.user = { id: result.insertId, first_name, last_name, email };
    req.flash('success', `Welcome, ${first_name}! Start your assessment below.`);
    res.redirect('/assess');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/auth/register');
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.flash('error', 'Please enter your email and password.');
    return res.redirect('/auth/login');
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      req.flash('error', 'No account found with that email.');
      return res.redirect('/auth/login');
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash('error', 'Incorrect password. Please try again.');
      return res.redirect('/auth/login');
    }

    req.session.user = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email
    };
    req.flash('success', `Welcome back, ${user.first_name}!`);
    res.redirect('/assess');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/auth/login');
  }
});

// GET /auth/logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;