// Feature ownership: Ronn Karimi (Feature: Issue Reporting & Listing)
// Now using MongoDB via Mongoose instead of in-memory data.

const Issue = require('../models/Issue');

const VALID_STATUSES = ['reported', 'acknowledged', 'pending', 'resolved'];

const getAllIssues = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const issues = await Issue.find(query)
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    next(error);
  }
};

const getIssueById = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reportedBy', 'name email');

    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    res.json(issue);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid issue ID' });
    }
    next(error);
  }
};

const createIssue = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const issue = new Issue({
      title,
      description,
      reportedBy: req.user._id,
      status: 'reported'
    });

    await issue.save();
    await issue.populate('reportedBy', 'name email');

    res.status(201).json(issue);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ errors: messages });
    }
    next(error);
  }
};

const updateIssueStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `Status must be one of: ${VALID_STATUSES.join(', ')}`
      });
    }

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('reportedBy', 'name email');

    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    res.json(issue);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllIssues,
  getIssueById,
  createIssue,
  updateIssueStatus
};
