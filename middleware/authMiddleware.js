const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    console.log('No Authorization header');
    return res.status(401).json({ error: 'No token' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('Token missing in Authorization header');
    return res.status(401).json({ error: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('User decoded from token:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Invalid token:', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};
