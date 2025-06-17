const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

router.get('/subjects', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT DISTINCT subject FROM courses ORDER BY subject'
    );
    res.json(result.rows.map(row => row.subject));
  } catch (err) {
    console.error("Error fetching subjects:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/numbers', async (req, res) => {
  const subject = req.query.subject;
  
  if (!subject) {
    return res.status(400).json({ error: "Subject is required" });
  }

  try {
    const result = await pool.query(
      `SELECT DISTINCT subject, course_number, title
       FROM courses 
       WHERE subject = $1
       ORDER BY course_number`, 
      [subject]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching course numbers:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/courses?subject=CS
router.get('/', async (req, res) => {
  const subject = req.query.subject;

  if (!subject) {
    return res.status(400).json({ error: "Subject is required" });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM courses
       WHERE LOWER(subject) = $1
       ORDER BY course_number
       LIMIT 200`, [subject.toLowerCase()]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching courses by subject:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/courses/:crn
router.get('/:crn', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM courses WHERE crn = $1`, [req.params.crn]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Course not found" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error("Error fetching course by CRN:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
