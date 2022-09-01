const { response, request } = require('express');

const isAdminRole = (req = request, res = response, next) => {
  if (!req.userAuthenticated) {
    return res.status(500).json({
      msg: 'Invalid token.',
    });
  }

  const { role, name } = req.userAuthenticated;
  if (role !== 'ADMIN_ROLE') {
    return res.status(401).json({
      msg: `${name} is not administrator`,
    });
  }

  next();
};

const hasRole = (...roles) => {
  return (req = request, res = response, next) => {
    if (!req.userAuthenticated) {
      return res.status(500).json({
        msg: 'Invalid token.',
      });
    }

    if (!roles.includes(req.userAuthenticated.role)) {
      return res.status(401).json({
        msg: `Service requires one of these roles ${roles}`,
      });
    }

    next();
  };
};

module.exports = {
  isAdminRole,
  hasRole,
};
