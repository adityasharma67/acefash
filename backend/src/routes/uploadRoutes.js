const express = require('express');
const { uploadImage } = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/image', protect, authorize('admin'), upload.single('image'), uploadImage);

module.exports = router;
