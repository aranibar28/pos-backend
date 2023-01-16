const { response } = require("express");
const { validationResult } = require("express-validator");

const validatorsFields = (req, res = response, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.mapped() });
  }
  next();
};

module.exports = {
  validatorsFields,
};
