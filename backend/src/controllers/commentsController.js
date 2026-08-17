// Initial scaffold by team lead (Frazier Kennedy) to give the team a working
// starting point. Feature ownership going forward: Alvan Ninjago
// (Feature: Status Updates & Comments). Please extend/commit to this file
// directly so your contributions are reflected in the repo history.

const store = require('../data/store');

const getComments = (req, res) => {
  const issueId = parseInt(req.params.id);
  const issueComments = store.comments.filter(c => c.issueId === issueId);
  res.json(issueComments);
};

const addComment = (req, res) => {
  const issueId = parseInt(req.params.id);
  const issue = store.issues.find(i => i.id === issueId);

  if (!issue) {
    return res.status(404).json({ error: 'Issue not found' });
  }

  const { author, text } = req.body;

  if (!author || !text) {
    return res.status(400).json({ error: 'Author and text are required' });
  }

  const newComment = {
    id: store.getNextCommentId(),
    issueId,
    author,
    text,
    createdAt: new Date().toISOString()
  };

  store.comments.push(newComment);
  res.status(201).json(newComment);
};

const deleteComment = (req, res) => {
  const issueId = parseInt(req.params.id);
  const commentId = parseInt(req.params.commentId);

  const commentIndex = store.comments.findIndex(
    c => c.id === commentId && c.issueId === issueId
  );

  if (commentIndex === -1) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  store.comments.splice(commentIndex, 1);
  res.status(204).send();
};

module.exports = {
  getComments,
  addComment,
  deleteComment
};
