const Product = require("../models/Products");

const increase_stock = async (id, qty) => {
  let product = await Product.findById(id);
  let new_stock = product.stock + qty;
  await Product.findByIdAndUpdate(id, { stock: new_stock });
};

const decrease_stock = async (id, qty) => {
  let product = await Product.findById(id);
  let new_stock = product.stock - qty;
  await Product.findByIdAndUpdate(id, { stock: new_stock });
};

module.exports = {
  increase_stock,
  decrease_stock,
};
