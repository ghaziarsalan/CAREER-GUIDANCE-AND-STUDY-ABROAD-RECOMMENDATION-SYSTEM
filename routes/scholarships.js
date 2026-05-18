const express = require('express');
const router  = express.Router();
const db      = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM scholarships ORDER BY country ASC, name ASC`
    );

    const grouped = {};
    rows.forEach(s => {
      if (!grouped[s.country]) grouped[s.country] = [];
      grouped[s.country].push(s);
    });

    const flags = {
      'USA'         : '🇺🇸',
      'Canada'      : '🇨🇦',
      'UK'          : '🇬🇧',
      'Australia'   : '🇦🇺',
      'Germany'     : '🇩🇪',
      'Sweden'      : '🇸🇪',
      'Netherlands' : '🇳🇱',
      'Europe'      : '🇪🇺',
      'Japan'       : '🇯🇵',
      'China'       : '🇨🇳',
      'Singapore'   : '🇸🇬',
      'South Korea' : '🇰🇷',
      'India'       : '🇮🇳',
    };

    res.render('scholarships', {
      grouped,
      flags,
      total: rows.length,
    });
  } catch (err) {
    console.error('Scholarships DB error:', err);
    req.flash('error', 'Could not load scholarships. Please try again.');
    res.redirect('/');
  }
});

module.exports = router;