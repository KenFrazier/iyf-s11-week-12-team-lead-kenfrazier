const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, restrictTo } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', protect, authController.getMe);

// Admin-only test route — proves restrictTo works
router.get('/admin-check', protect, restrictTo('admin'), (req, res) => {
  res.json({ message: `Welcome, admin ${req.user.name}. This page is admin-only.` });
});

module.exports = router;
