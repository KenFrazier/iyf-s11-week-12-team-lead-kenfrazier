const express = require('express');
const router = express.Router();
const issuesController = require('../controllers/issuesController');
const commentsController = require('../controllers/commentsController');
const { protect, restrictTo } = require('../middleware/auth');

// Public routes — anyone can view issues
router.get('/', issuesController.getAllIssues);
router.get('/:id', issuesController.getIssueById);

// Protected routes — must be logged in
router.get('/:id/comments', protect, commentsController.getComments);
router.post('/', protect, issuesController.createIssue);
router.patch('/:id/status', protect, restrictTo('elder', 'admin', 'specialist'), issuesController.updateIssueStatus);
router.post('/:id/comments', protect, commentsController.addComment);
router.delete('/:id/comments/:commentId', protect, restrictTo('admin'), commentsController.deleteComment);

module.exports = router;
