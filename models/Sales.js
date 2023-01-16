const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const SaleSchema = new Schema(
  {
    business:   { type: Schema.Types.ObjectId, required: true, ref: "Business" },
    document:   { type: String, required: true },
    customer:   { type: String, required: false },
    address:    { type: String, required: false },
    amount:     { type: Number, required: false },
    tax:        { type: Number, required: false },
    type:       { type: String, required: false },
    serie:      { type: String, required: false },
    number:     { type: String, required: false },
    created_at: { type: Date, required: false, default: Date.now },
  },
);

SaleSchema.plugin(mongoosePaginate);
SaleSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Sale", SaleSchema);
