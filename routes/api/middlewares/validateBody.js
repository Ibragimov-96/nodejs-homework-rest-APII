const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: "произошла беда" });
    }
    next();
  };
};
const validateEmail = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: "_~_~_~_~_~_~_~" });
    }
    next();
  };
};

module.exports = { validateBody, validateEmail };
