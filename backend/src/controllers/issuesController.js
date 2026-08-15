// Initial scaffold by team lead (Frazier Kennedy) to give the team a working
// starting point. Feature ownership going forward: Ronn Karimi
// (Feature: Issue Reporting & Listing). Please extend/commit to this file
// directly so your contributions are reflected in the repo history.

const store = require('../data/store');

const VALID_STATUSES = ['reported', 'acknowledged', 'pending', 'resolved'];

const getAllIssues = (req, res) => {
  const { status, search } = req.query;

  let result = [...store.issues];

  if (status) {
    result = result.filter(issue => issue.status === status);
  }

  if (search) {
    result = result.filter(issue =>
      issue.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json(result);
};

const getIssueById = (req, res) => {
  const id = parseInt(req.params.id);
  const issue = store.issues.find(i => i.id === id);

  if (!issue) {
    return res.status(404).json({ error: 'Issue not found' });
  }

  res.json(issue);
};

const createIssue = (req, res) => {
  const { title, description, reportedBy } = req.body;

  if (!title || !description || !reportedBy) {
    return res.status(400).json({
      error: 'Title, description, and reportedBy are required'
    });
  }

  const newIssue = {
    id: store.getNextIssueId(),
    title,
    description,
    reportedBy,
    status: 'reported',
    createdAt: new Date().toISOString()
  };

  store.issues.push(newIssue);
  res.status(201).json(newIssue);
};

const updateIssueStatus = (req, res) => {
  const id = parseInt(req.params.id);
  const issue = store.issues.find(i => i.id === id);

  if (!issue) {
    return res.status(404).json({ error: 'Issue not found' });
  }

  const { status } = req.body;

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `Status must be one of: ${VALID_STATUSES.join(', ')}`
    });
  }

  issue.status = status;
  issue.updatedAt = new Date().toISOString();
  res.json(issue);
};

module.exports = {
  getAllIssues,
  getIssueById,
  createIssue,
  updateIssueStatus
};
