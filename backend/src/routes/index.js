const express = require('express');
const router = express.Router();

const issuesRoutes = require('./issues');
const usersRoutes = require('./users');
const authRoutes = require('./auth');
const adminRoutes = require('./admin');

router.use('/issues', issuesRoutes);
router.use('/users', usersRoutes);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

module.exports = router;
