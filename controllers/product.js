const { response } = require("express");
const { generateSlug } = require("../utils/functions");
const { deleteImage } = require("../middlewares/cloudinary");
const { increase_stock, decrease_stock } = require("../utils/features");
const Product = require("../models/Products");
const Inventory = require("../models/Inventories");
const SaleDetails = require("../models/SaleDetails");
const moment = require("moment");

const create_product = async (req, res = response) => {
  let data = req.body;
  try {
    let exist_title = await Product.findOne({ title: data.title });

    if (exist_title) {
      return res.json({ msg: "Este título ya se encuentra registrado.", exist: true });
    } else {
      data.slug = generateSlug(data.title);
      let reg = await Product.create(data);
      return res.json({ data: reg });
    }
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_products = async (req, res = response) => {
  const { page = 1, limit = 10, search = "", status, order } = req.query;
  const sort = order == "desc" ? 1 : -1;

  try {
    const query = {
      title: { $regex: search, $options: "i" },
      status: { $ne: null },
    };

    if (status) {
      query.status = status;
    }

    const options = {
      page,
      limit,
      sort: { created_at: sort },
      populate: "category",
    };

    let reg = await Product.paginate(query, options);

    return res.json(reg);
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_all_products = async (req, res = response) => {
  try {
    let reg = await Product.find({ status: { $ne: null } });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_product_by_id = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Product.findById(id);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const update_product = async (req, res = response) => {
  let id = req.params["id"];
  const { title, ...data } = req.body;

  try {
    const product = await Product.findById(id);

    if (product.title != title) {
      const exist_title = await Product.findOne({ title });
      if (exist_title) {
        return res.json({ msg: "Este título ya se encuentra registrado.", exist: true });
      }
    }

    data.title = title;
    data.slug = generateSlug(title);

    let reg = await Product.findByIdAndUpdate(id, data, { new: true });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const delete_product = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let product = await Product.findById(id);
    if (product.stock != 0) {
      return res.json({ msg: "El stock debe estar en 0 para eliminarlo." });
    }

    let reg = await Product.findByIdAndDelete(id);
    if (reg.image.public_id) {
      await deleteImage(reg.image.public_id);
    }
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

// Inventario
const create_inventory = async (req, res = response) => {
  let data = req.body;
  try {
    let reg = await Inventory.create(data);
    increase_stock(reg.product, reg.quantity);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const delete_inventory = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Inventory.findByIdAndDelete(id);
    decrease_stock(reg.product, reg.quantity);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_inventory_input = async (req, res = response) => {
  const { page = 1, limit = 10, start, end } = req.query;
  const format = "DD-MM-YYYY";

  try {
    const query =
      start && end
        ? {
            created_at: {
              $gte: moment(start, format).startOf("day").format(),
              $lte: moment(end, format).endOf("day").format(),
            },
          }
        : {};

    const options = {
      page,
      limit,
      sort: { created_at: -1 },
      populate: [{ path: "product" }, { path: "supplier" }],
    };

    let reg = await Inventory.paginate(query, options);

    return res.json(reg);
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_inventory_output = async (req, res = response) => {
  const { page = 1, limit = 10, start, end } = req.query;
  const format = "DD-MM-YYYY";
  try {
    const query =
      start && end
        ? {
            created_at: {
              $gte: moment(start, format).startOf("day").format(),
              $lte: moment(end, format).endOf("day").format(),
            },
          }
        : {};

    const options = {
      page,
      limit,
      sort: { created_at: -1 },
      populate: [{ path: "product" }, { path: "sale" }],
    };

    let reg = await SaleDetails.paginate(query, options);
    return res.json(reg);
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

module.exports = {
  create_product,
  read_products,
  read_all_products,
  read_product_by_id,
  update_product,
  delete_product,
  create_inventory,
  read_inventory_input,
  read_inventory_output,
  delete_inventory,
};
