const { response } = require("express");
const { titleCase } = require("../utils/functions");
const { admin } = require("../utils/data");

const User = require("../models/Users");
const User_Branch = require("../models/UserBranchs");
const Business_Config = require("../models/BusinessConfig");
const jwt = require("../utils/jwt");
const bcrypt = require("bcryptjs");

const create_user = async (req, res = response) => {
  let data = req.body;
  try {
    let exist_email = await User.findOne({ email: data.email });
    if (exist_email) {
      return res.json({ msg: "Este correo ya se encuentra registrado." });
    } else {
      data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync());
      data.full_name = titleCase(data.first_name + " " + data.last_name);
      let reg = await User.create(data);
      return res.json({ data: reg });
    }
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_users = async (req, res = response) => {
  const { page = 1, limit = 10, search = "", status, order } = req.query;
  const sort = order == "desc" ? 1 : -1;

  try {
    const query = {
      full_name: { $regex: search, $options: "i" },
      status: { $ne: null },
    };

    if (status) {
      query.status = status;
    }

    const options = {
      page,
      limit,
      sort: { created_at: sort },
    };

    let reg = await User.paginate(query, options);

    return res.json(reg);
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_user_by_id = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await User.findById(id);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_all_users = async (req, res = response) => {
  try {
    let reg = await User.find();
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const update_user = async (req, res = response) => {
  let id = req.params["id"];

  try {
    const user = await User.findById(id);
    const { email, password, ...data } = req.body;

    if (user.email != email) {
      var exist_email = await User.findOne({ email });
      if (exist_email) {
        return res.json({ msg: "Este correo ya se encuentra registrado.", exist: true });
      } else {
        data.email = email;
      }
    }

    if (user.password != password) {
      data.password = bcrypt.hashSync(password, bcrypt.genSaltSync());
    } else {
      data.password = password;
    }

    data.full_name = titleCase(data.first_name + " " + data.last_name);
    let reg = await User.findByIdAndUpdate(id, data, { new: true });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const delete_user = async (req, res = response) => {
  let id = req.params["id"];
  try {
    if (admin._id == id) {
      return res.json({ msg: "No puedes eliminar a un administrador." });
    }

    if (req.id == id) {
      return res.json({ msg: "No puedes eliminar un usuario con sesión iniciada." });
    }

    const hasRole = await User_Branch.findOne({ user: id }).exec();
    if (hasRole) {
      return res.json({ msg: "No puedes eliminar un usuario con rol asignado." });
    }

    let reg = await User.findByIdAndDelete(id);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const login_user = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.json({ msg: "El correo o la contraseña son incorrectos." });
    } else {
      let role = (await User_Branch.findOne({ user: user._id })) || false;
      let valid_password = bcrypt.compareSync(password, user.password);
      if (!valid_password) {
        return res.json({ msg: "El correo o la contraseña son incorrectos." });
      } else {
        if (!user.status || !role.status) {
          return res.json({ msg: "El usuario no tiene acceso al sistema." });
        } else {
          let token = await jwt.createToken(user);
          return res.json({ data: user, token });
        }
      }
    }
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const renew_token = async (req, res = response) => {
  try {
    let id = req.id;

    let data = await User_Branch.findOne({ user: id }).populate([
      { path: "user", select: "_id full_name email" },
      { path: "role", select: "_id title allows status" },
      { path: "business", select: "_id title ruc address" },
    ]);

    let config = await Business_Config.findOne({ business: data.business });

    if (!data) {
      return res.json({ msg: "Usuario no permitido." });
    }

    const { user, role } = data;

    const payload = new Object({
      _id: user._id,
      full_name: user.full_name,
      email: user.email,
      role: role.title,
      allows: role.allows,
    });

    let token = await jwt.createToken(payload);

    return res.json({ data, config, token });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

module.exports = {
  create_user,
  read_users,
  read_all_users,
  read_user_by_id,
  update_user,
  delete_user,
  login_user,
  renew_token,
};
