const express = require('express');
const cors = require('cors');
require('dotenv').config();

const coursesRouter = require('./routes/courses');

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL
}));
app.use(express.json());

app.use('/api/courses', coursesRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
