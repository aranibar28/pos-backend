const { Schema, model } = require("mongoose");
const { timestamps } = require("../utils/data");
const mongoosePaginate = require("mongoose-paginate-v2");

const Sale_DetailSchema = Schema(
  {
    sale:     { type: Schema.Types.ObjectId, required: true, ref: "Sale" },
    product:  { type: Schema.Types.ObjectId, required: true, ref: "Product" },
    quantity: { type: Number, required: true },
    price:    { type: Number, required: true },
  },
  timestamps
);

Sale_DetailSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

Sale_DetailSchema.plugin(mongoosePaginate);
module.exports = model("Sale_Detail", Sale_DetailSchema);
