const express = require('express');
const { createBlogs, getAllBlogs } = require('../controllers/blogs');
const router = express.Router();

router.post('/create/blogs', createBlogs);
router.get('/get/all/blogs', getAllBlogs);

module.exports = router;