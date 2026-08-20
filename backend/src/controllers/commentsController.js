// Feature ownership: Alvan Ninjago (Feature: Status Updates & Comments)

const Comment = require('../models/Comment');
const Issue = require('../models/Issue');

const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ issue: req.params.id })
      .populate('author', 'name email role')
      .sort({ createdAt: -1 });

    const isAdmin = req.user && req.user.role === 'admin';

    const result = comments.map(comment => {
      const commentObj = comment.toObject();
      if (isAdmin) {
        commentObj.isFromSpecialist = comment.author.role === 'specialist';
      }
      return commentObj;
    });

    res.json(result);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid issue ID' });
    }
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const comment = new Comment({
      text,
      author: req.user._id,
      issue: req.params.id
    });

    await comment.save();
    await comment.populate('author', 'name email role');

    res.status(201).json(comment);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid issue ID' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ errors: messages });
    }
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findOneAndDelete({
      _id: req.params.commentId,
      issue: req.params.id
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.status(204).send();
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    next(error);
  }
};

module.exports = {
  getComments,
  addComment,
  deleteComment
};
