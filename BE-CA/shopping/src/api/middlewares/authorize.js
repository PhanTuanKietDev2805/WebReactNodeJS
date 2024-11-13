const { ValidateSignature } = require("../../utils");
const authorize = (roles) => {
  return async (req, res, next) => {
    const isAuthorized = await ValidateSignature(req);
    if (isAuthorized) {
      if (roles.length && roles !== req.user.role) {
        return res.status(403).json({ message: "Permission Denined" });
      }
      return next();
    }
    return res.status(403).json({ message: "Not Authorized" });
  };
};

module.exports = { authorize };
