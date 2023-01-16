const { response } = require("express");
const Role = require("../models/Roles");
const Business_Config = require("../models/BusinessConfig");
const User_Branch = require("../models/UserBranchs");

const create_role = async (req, res = response) => {
  let data = req.body;
  try {
    let exist_title = await Role.findOne({ title: data.title });

    if (exist_title) {
      return res.json({ msg: "Este título ya se encuentra registrado." });
    }

    let reg = await Role.create(data);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_roles = async (req, res = response) => {
  try {
    let reg = await Role.find();
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_role_by_id = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Role.findById(id);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const update_role = async (req, res = response) => {
  let id = req.params["id"];

  try {
    const role = await Role.findById(id);
    const { title, ...data } = req.body;

    if (role.title != title) {
      var exist_role = await Role.findOne({ title });
      if (exist_role) {
        return res.json({ msg: "Este rol ya se encuentra registrado." });
      } else {
        data.title = title;
      }
    }

    let reg = await Role.findByIdAndUpdate(id, data, { new: true });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const delete_role = async (req, res = response) => {
  let id = req.params["id"];
  try {
    const exist = await User_Branch.findOne({ role: id });
    if (exist) {
      return res.json({ msg: "No puedes eliminar un rol asignado." });
    }

    let reg = await Role.findByIdAndDelete(id);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

// USER ROLES:
const create_branch = async (req, res = response) => {
  let data = req.body;
  try {
    const exist = await User_Branch.findOne({ user: data.user });
    if (exist) {
      return res.json({ msg: "Este usuario ya tiene un rol asignado." });
    }
    let reg = await User_Branch.create(data);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_branch = async (req, res = response) => {
  try {
    let reg = await User_Branch.find().populate([
      { path: "user", select: "_id full_name" },
      { path: "role", select: "_id title" },
      { path: "business", select: "_id title" },
    ]);

    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const update_branch = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let data = req.body;
    let fx = await User_Branch.findById(id);
    if (fx) {
      if (req.id == fx.user && data.role != fx.role) {
        return res.json({ msg: "No puedes cambiar el estado a un usuario con sesión iniciada." });
      }
    }

    let reg = await User_Branch.findByIdAndUpdate(id, data, { new: true }).populate("role business");
    let config = await Business_Config.findOne({ business: reg.business });
    return res.json({ data: reg, config });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const delete_branch = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let fx = await User_Branch.findById(id);
    if (fx) {
      if (req.id == fx.user) {
        return res.json({ msg: "No puedes eliminar a un usuario con sesión iniciada." });
      }
    }

    let reg = await User_Branch.findByIdAndDelete(id);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

module.exports = {
  create_role,
  read_roles,
  read_role_by_id,
  update_role,
  delete_role,
  create_branch,
  read_branch,
  update_branch,
  delete_branch,
};
