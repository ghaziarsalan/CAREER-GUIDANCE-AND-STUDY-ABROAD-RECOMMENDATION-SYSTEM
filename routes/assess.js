const express = require('express');
const router  = express.Router();
const db      = require('../db');
const logic   = require('../models/logic');

const {
  computeScores,
  getCareerRecommendations,
  getCountryRecommendations,
  getAfter12thRecommended,
  after12thCareers,
  streamMeta,
  riasecNames,
  careerDetails,
  sectionTitles,
} = logic;

/* ─────────────────────────────────────────────
   Auth guard
───────────────────────────────────────────── */
function requireLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', 'Please log in to access the assessment.');
    return res.redirect('/auth/login');
  }
  next();
}

/* ─────────────────────────────────────────────
   GET /assess  — form + past history
───────────────────────────────────────────── */
router.get('/', requireLogin, async (req, res) => {
  var history = [];

  try {
    const [rows] = await db.query(
      `SELECT * FROM results
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 5`,
      [req.session.user.id]
    );

    history = rows.map(function (r) {
      var scores = {};
      try { scores = JSON.parse(r.scores_json || '{}'); } catch (_) {}

      var sorted = Object.entries(scores).sort(function (a, b) {
        return b[1] - a[1];
      });

      var careers = [];
      try {
        var result = getCareerRecommendations(r.top_type1 || 'R', r.top_type2 || 'I');
        careers = Array.isArray(result) ? result : [];
      } catch (_) { careers = []; }

      var dateFormatted = '—';
      try {
        dateFormatted = new Date(r.created_at).toLocaleDateString('en-IN', {
          day: 'numeric', month: 'short', year: 'numeric'
        });
      } catch (_) {}

      return {
        id:            r.id,
        edu_level:     r.edu_level   || '',
        marks:         r.marks       || '',
        budget:        r.budget      || '',
        destination:   r.destination || '',
        stream:        r.stream      || '',
        top_type1:     r.top_type1   || '',
        top_type2:     r.top_type2   || '',
        scores:        scores,
        sorted:        sorted,
        type1Name:     riasecNames[r.top_type1] || r.top_type1 || '—',
        type2Name:     riasecNames[r.top_type2] || r.top_type2 || '—',
        topCareers:    careers.slice(0, 3),
        dateFormatted: dateFormatted,
      };
    });

  } catch (err) {
    console.error('History fetch error:', err.message);
    history = [];
  }

  res.render('assess', { history: history });
});

/* ─────────────────────────────────────────────
   POST /assess/submit
───────────────────────────────────────────── */
router.post('/submit', requireLogin, async (req, res) => {
  var edu_level   = req.body.edu_level   || '';
  var stream      = req.body.stream      || null;
  var marks       = req.body.marks       || '';
  var budget      = req.body.budget      || '';
  var destination = req.body.destination || '';

  /* Build answers object — strip background fields */
  var answers = {};
  Object.keys(req.body).forEach(function (key) {
    if (!['edu_level','stream','marks','budget','destination'].includes(key)) {
      answers[key] = req.body[key];
    }
  });

  /* Validate */
  if (!edu_level || !marks || !budget || !destination) {
    req.flash('error', 'Please fill in all background fields.');
    return res.redirect('/assess');
  }

  /* RIASEC scores */
  var scores  = computeScores(answers);
  var sorted  = Object.entries(scores).sort(function (a, b) { return b[1] - a[1]; });
  var top1    = sorted[0][0];
  var top2    = sorted[1][0];

  var careers   = getCareerRecommendations(top1, top2);
  var countries = getCountryRecommendations(budget, destination);

  /* After-12th */
  var after12th            = null;
  var after12thRecommended = [];
  var streamInfo           = null;

  if (edu_level === '12th' && stream && after12thCareers[stream]) {
    after12th            = after12thCareers[stream];
    after12thRecommended = getAfter12thRecommended(stream, top1, top2);
    streamInfo           = streamMeta[stream] || null;
  }

  /* Scholarships */
  var countryNames = countries.map(function (c) { return c.name; });
  var levelMap = {
    '10th':       ['Undergraduate'],
    '12th':       ['Undergraduate'],
    'graduation': ['Masters', 'Masters/PhD', 'Postgraduate', 'All Levels'],
    'postgrad':   ['PhD', 'Postdoc', 'Masters/PhD', 'All Levels'],
  };
  var validLevels = levelMap[edu_level] || ['All Levels'];
  var scholarships = [];

  try {
    var ph = countryNames.map(function () { return '?'; }).join(',');
    const [allRows] = await db.query(
      'SELECT * FROM scholarships WHERE country IN (' + ph + ')',
      countryNames
    );
    scholarships = (allRows || []).filter(function (s) {
      return validLevels.some(function (l) {
        return s.level.includes(l.split('/')[0]);
      }) || s.level === 'All Levels';
    });

    if (!scholarships.length) {
      const [fb] = await db.query(
        "SELECT * FROM scholarships WHERE level = 'All Levels' LIMIT 6"
      );
      scholarships = fb || [];
    }
  } catch (err) {
    console.error('Scholarship DB error:', err.message);
    scholarships = [];
  }

  /* Save result — gracefully handle missing stream column */
  try {
    await db.query(
      `INSERT INTO results
         (user_id, edu_level, marks, budget, destination, top_type1, top_type2, scores_json, stream)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.session.user.id,
        edu_level, marks, budget, destination,
        top1, top2,
        JSON.stringify(scores),
        stream || null,
      ]
    );
  } catch (err) {
    /* If stream column still missing, retry without it */
    if (err.code === 'ER_BAD_FIELD_ERROR') {
      try {
        await db.query(
          `INSERT INTO results
             (user_id, edu_level, marks, budget, destination, top_type1, top_type2, scores_json)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            req.session.user.id,
            edu_level, marks, budget, destination,
            top1, top2,
            JSON.stringify(scores),
          ]
        );
      } catch (err2) {
        console.error('History save error (fallback):', err2.message);
      }
    } else {
      console.error('History save error:', err.message);
    }
  }

  /* Render — pass ALL logic data so result.ejs never needs require() */
  res.render('result', {
    user:                req.session.user,
    scores:              scores,
    sorted:              sorted,
    top1:                top1,
    top2:                top2,
    careers:             careers,
    countries:           countries,
    scholarships:        scholarships,
    edu_level:           edu_level,
    stream:              stream,
    after12th:           after12th,
    after12thRecommended:after12thRecommended,
    streamInfo:          streamInfo,
    /* ↓ Pass these so result.ejs never calls require() ↓ */
    riasecNames:         riasecNames,
    careerDetails:       careerDetails   || {},
    sectionTitles:       sectionTitles   || {},
  });
});

module.exports = router;