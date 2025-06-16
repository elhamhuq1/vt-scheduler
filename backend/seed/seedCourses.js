const fs = require('fs');
const pool = require('../db/connection');
const format = require('pg-format');

async function seed() {
  const courses = JSON.parse(fs.readFileSync('./seed/courses.json', 'utf-8'));

  console.log(`Seeding ${courses.length} courses...`);

  // Build values array
  const values = courses.map(course => [
    course.crn,
    course.subject,
    course.course_number,
    course.title,
    course.modality,
    course.credit_hours,
    course.capacity,
    course.instructor,
    course.days,
    course.begin_time,
    course.end_time,
    course.location,
    course.comments
  ]);

  const insertQuery = format(`
    INSERT INTO courses (
      crn, subject, course_number, title, modality, credit_hours,
      capacity, instructor, days, begin_time, end_time, location, comments
    ) VALUES %L`, values);

  try {
    await pool.query("DELETE FROM courses"); // Optional: clear old data
    await pool.query(insertQuery);
    console.log("Seeding complete!");
    process.exit();
  } catch (err) {
    console.error("Error during seeding:", err);
    process.exit(1);
  }
}

seed();
