const { Schema, model } = require("mongoose");
const { timestamps } = require("../utils/data")

const User_BranchSchema = Schema({
  status:   { type: Boolean, required: true, default: false },
  user:     { type: Schema.Types.ObjectId, required: true, ref: "User" },
  role:     { type: Schema.Types.ObjectId, required: true, ref: "Role" },
  business: { type: Schema.Types.ObjectId, required: true, ref: "Business" },
}, timestamps );

User_BranchSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("User_Branch", User_BranchSchema);
