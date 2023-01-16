const { response } = require("express");
const { admin, role, business, config, branch } = require("../utils/data");

const User = require("../models/Users");
const Role = require("../models/Roles");
const Business = require("../models/Business");
const Business_Config = require("../models/BusinessConfig");
const User_Branch = require("../models/UserBranchs");

const seed_data = async (req, res = response) => {
  try {
    let existData = await User.count();
    if (!existData) {
      await User.create(admin);
      await Role.create(role);
      await Business.create(business);
      await Business_Config.create(config);
      await User_Branch.create(branch);
      return res.json({ msg: "Data seeded successfully." });
    } else {
      return res.json({ msg: "Data already exists." });
    }
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

module.exports = {
  seed_data,
};
