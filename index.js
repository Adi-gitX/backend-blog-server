const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { createBlog, showAllBlogs, showBlog, updateBlog, deleteBlog } = require('./controllers/blogController');
const { registerUser, loginUser, authenticateToken } = require('./controllers/authController');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = express.Router();
authRoutes.post('/register', registerUser);
authRoutes.post('/login', loginUser);

const blogRoutes = express.Router();
blogRoutes.post('/', authenticateToken, createBlog);
blogRoutes.get('/', showAllBlogs);
blogRoutes.get('/:id', showBlog);
blogRoutes.put('/:id', authenticateToken, updateBlog);
blogRoutes.delete('/:id', authenticateToken, deleteBlog);

// Use routes
app.use('/auth', authRoutes);
app.use('/blogs', blogRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3002;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to the database', err);
    process.exit(1);
  });
