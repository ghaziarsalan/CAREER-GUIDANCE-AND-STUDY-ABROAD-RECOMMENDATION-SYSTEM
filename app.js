const express = require('express');
const session = require('express-session');
const flash   = require('connect-flash');
const path    = require('path');
require('dotenv').config();

const homeRoutes         = require('./routes/home');
const authRoutes         = require('./routes/auth');
const assessRoutes       = require('./routes/assess');
const scholarshipsRoutes = require('./routes/scholarships');

const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Flash messages
app.use(flash());

// Global middleware — pass user + flash to all views
app.use((req, res, next) => {
  res.locals.user    = req.session.user || null;
  res.locals.success = req.flash('success');
  res.locals.error   = req.flash('error');
  next();
});

// Routes
app.use('/',             homeRoutes);
app.use('/auth',         authRoutes);
app.use('/assess',       assessRoutes);
app.use('/scholarships', scholarshipsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('404');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CareerGuide running at http://localhost:${PORT}`);
});