const { Schema, model } = require("mongoose");
const { timestamps } = require("../utils/data")
const mongoosePaginate = require('mongoose-paginate-v2');

const CategorySchema = new Schema(
  {
    title:       { type: String, required: true },
    description: { type: String, required: true },
    status:      { type: Boolean, required: true, default: false },
  }, 
  timestamps
);

CategorySchema.index({ title: "text" });
CategorySchema.plugin(mongoosePaginate);
CategorySchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Category", CategorySchema);
