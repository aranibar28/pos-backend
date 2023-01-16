const { Schema, model } = require("mongoose");
const { timestamps } = require("../utils/data")
const mongoosePaginate = require('mongoose-paginate-v2');

const ProductSchema = new Schema(
  {
    title:       { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    slug:        { type: String, required: false },
    stock:       { type: Number, required: false, default: 0 },
    price:       { type: Number, required: false, default: 0 },
    image:       { type: Object, required: false, default: {} },
    status:      { type: Boolean, required: true, default: false },
    category:    { type: Schema.Types.ObjectId, required: true, ref: "Category" },
  }, 
  timestamps
);

ProductSchema.plugin(mongoosePaginate);
ProductSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Product", ProductSchema);
