<<<<<<< HEAD
# CareerGuide — AI-Based Career Guidance System

A full-stack web application that helps students make informed career decisions using a **RIASEC psychometric model** and **rule-based intelligent system**.

---

## Tech Stack

| Layer       | Technology                      |
|-------------|----------------------------------|
| Frontend    | HTML, CSS, JavaScript (vanilla) |
| Templating  | EJS                             |
| Backend     | Node.js + Express.js            |
| Database    | MySQL (via mysql2)              |
| Auth        | bcryptjs + express-session      |

---

## Project Structure

```
career-guide/
├── app.js                  ← Express server entry point
├── db.js                   ← MySQL connection pool
├── schema.sql              ← DB schema + scholarship data
├── .env                    ← Environment variables
├── package.json
│
├── routes/
│   ├── home.js             ← GET /
│   ├── auth.js             ← POST /auth/login, /auth/register, /auth/logout
│   └── assess.js           ← GET /assess, POST /assess/submit
│
├── models/
│   └── logic.js            ← RIASEC scoring + career/country rules
│
├── views/
│   ├── home.ejs            ← Landing page
│   ├── login.ejs           ← Login form
│   ├── register.ejs        ← Register form
│   ├── assess.ejs          ← Assessment form (3 sections)
│   ├── result.ejs          ← Results page
│   ├── 404.ejs             ← Not found page
│   └── partials/
│       ├── head.ejs
│       ├── nav.ejs
│       ├── flash.ejs
│       └── foot.ejs
│
└── public/
    ├── css/style.css
    └── js/main.js
```

---

## Setup Instructions

### 1. Clone / download the project

```bash
cd career-guide
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up MySQL database

Make sure MySQL is running, then run:

```bash
mysql -u root -p < schema.sql
```

This will:
- Create the `career_db` database
- Create `users`, `scholarships`, and `results` tables
- Insert all 30 scholarship records

### 4. Configure environment variables

Edit `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=career_db
SESSION_SECRET=any_long_random_string
PORT=3000
```

### 5. Run the server

```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

Open **http://localhost:3000** in your browser.

---

## Application Flow

```
Home (/) → Register/Login → Assessment (/assess) → Results
```

1. **Home page** — hero section, features, stats, how-it-works
2. **Register** — creates account with bcrypt-hashed password
3. **Login** — validates credentials, starts session
4. **Assessment** — 3 sections: background info + 11 RIASEC questions
5. **Results** — RIASEC score chart, career paths, countries, scholarships

---

## RIASEC Scoring Logic

Each question maps to one or more RIASEC categories with weights:

| Code | Type         | Sample trait              |
|------|--------------|---------------------------|
| R    | Realistic    | Hands-on, mechanical      |
| I    | Investigative| Analytical, scientific    |
| A    | Artistic     | Creative, expressive      |
| S    | Social       | Helpful, communicative    |
| E    | Enterprising | Leadership, persuasive    |
| C    | Conventional | Organised, detail-oriented|

Top 2 scores determine the career cluster and study destination.

---

## Future Enhancements

- Admin panel to manage scholarships
- Result history per user
- OpenAI API integration for detailed explanations
- PDF export of results
- Email notifications
=======
# CAREER-GUIDANCE-AND-STUDY-ABROAD-RECOMMENDATION-SYSTEM
A full-stack web application designed to help students choose the right career path and explore study abroad opportunities based on their interests, skills, academic background, and goals. The platform also provides scholarship information for both international studies and higher education opportunities in India.
>>>>>>> e77489087f9f20b29b3128c09fe947474d3d0374
