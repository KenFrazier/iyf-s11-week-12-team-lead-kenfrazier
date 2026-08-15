const express = require('express');
const router = express.Router();
const issuesController = require('../controllers/issuesController');
const commentsController = require('../controllers/commentsController');

router.get('/', issuesController.getAllIssues);
router.get('/:id', issuesController.getIssueById);
router.post('/', issuesController.createIssue);
router.patch('/:id/status', issuesController.updateIssueStatus);

router.get('/:id/comments', commentsController.getComments);
router.post('/:id/comments', commentsController.addComment);
router.delete('/:id/comments/:commentId', commentsController.deleteComment);

module.exports = router;
