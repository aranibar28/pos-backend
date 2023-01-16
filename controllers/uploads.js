const User = require("../models//Users");
const Category = require("../models/Categories");
const Product = require("../models/Products");
const BusinessConfig = require("../models/BusinessConfig");

const { uploadImage, deleteImage } = require("../middlewares/cloudinary");
const fs = require("fs");

const upload_image = async (req, res = response) => {
  const id = req.params["id"];
  const entityType = req.params.type;
  const validEntityTypes = ["business", "users", "categories", "products"];

  if (!validEntityTypes.includes(entityType)) {
    return res.json({ msg: "No es un tipo válido" });
  }

  if (req.files) {
    const tempFilePath = req.files.image.tempFilePath;
    const { public_id, secure_url } = await uploadImage(tempFilePath, entityType);
    const image = { public_id, secure_url };

    switch (entityType) {
      case "business":
        await updateCompanyImage(id, BusinessConfig, image, tempFilePath);
        break;
      case "products":
        await updateEntityImage(id, Product, image, tempFilePath);
        break;
      case "categories":
        await updateEntityImage(id, Category, image, tempFilePath);
        break;
      case "users":
        await updateEntityImage(id, User, image, tempFilePath);
        break;
    }
  }

  return res.json({ data: true });
};

const updateEntityImage = async (id, Model, image, tempFilePath) => {
  let entity = await Model.findById(id);
  if (!entity) {
    throw new Error(`No se encontró una entidad ${Model.modelName} con ID ${id}`);
  }
  await Model.findByIdAndUpdate(id, { image });
  fs.unlinkSync(tempFilePath);
  if (entity.image.public_id) {
    await deleteImage(entity.image.public_id);
  }
};

const updateCompanyImage = async (id, Model, image, tempFilePath) => {
  let entity = await Model.findOne({ business: id });
  if (!entity) {
    throw new Error(`No se encontró una entidad ${Model.modelName} con ID ${id}`);
  }
  await Model.findOneAndUpdate({ business: id }, { image });
  fs.unlinkSync(tempFilePath);
  if (entity.image.public_id) {
    await deleteImage(entity.image.public_id);
  }
};

module.exports = {
  upload_image,
};
