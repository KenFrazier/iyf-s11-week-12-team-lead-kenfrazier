const store = require('../data/store');

const getAllUsers = (req, res) => {
  res.json(store.users);
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  const user = store.users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
};

const createUser = (req, res) => {
  const { name, email, role } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('A valid email is required');
  }

  const validRoles = ['citizen', 'elder', 'admin', 'specialist'];
  if (role && !validRoles.includes(role)) {
    errors.push(`Role must be one of: ${validRoles.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const newUser = {
    id: store.getNextUserId(),
    name,
    email,
    role: role || 'citizen'
  };

  store.users.push(newUser);
  res.status(201).json(newUser);
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser
};
