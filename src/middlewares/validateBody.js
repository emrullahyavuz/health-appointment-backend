const Joi = require("joi");

// Validate body or query middleware
function validateBody(schema, type = "body") {
  return (req, res, next) => {
    const dataToValidate = type === "query" ? req.query : req.body;
    const { error } = schema.validate(dataToValidate);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
}

module.exports = validateBody; 