const express = require('express');
const { createBlogs, getAllBlogs, getABlog } = require('../controllers/blogs');
const router = express.Router();

router.post('/create/blogs', createBlogs);
router.get('/get/all/blogs', getAllBlogs);
router.get('/get/a/blog/:bId', getABlog);

module.exports = router;