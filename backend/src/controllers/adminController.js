const Issue = require('../models/Issue');
const User = require('../models/User');

const getDashboard = async (req, res, next) => {
  try {
    const totalIssues = await Issue.countDocuments();
    const reported = await Issue.countDocuments({ status: 'reported' });
    const acknowledged = await Issue.countDocuments({ status: 'acknowledged' });
    const pending = await Issue.countDocuments({ status: 'pending' });
    const resolved = await Issue.countDocuments({ status: 'resolved' });
    const totalUsers = await User.countDocuments();

    res.json({
      message: `Welcome to the admin dashboard, ${req.user.name}`,
      stats: {
        totalIssues,
        byStatus: { reported, acknowledged, pending, resolved },
        totalUsers
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };
