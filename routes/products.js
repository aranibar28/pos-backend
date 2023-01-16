const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const ctrl = require("../controllers/product");
const router = Router();

router.post("/create_product", [validateJWT], ctrl.create_product);
router.get("/read_products", [validateJWT], ctrl.read_products);
router.get("/read_all_products", [validateJWT], ctrl.read_all_products);
router.get("/read_product_by_id/:id", [validateJWT], ctrl.read_product_by_id);
router.put("/update_product/:id", [validateJWT], ctrl.update_product);
router.delete("/delete_product/:id", [validateJWT], ctrl.delete_product);
router.post("/create_inventory", [validateJWT], ctrl.create_inventory);
router.get("/read_inventory_input", [validateJWT], ctrl.read_inventory_input);
router.get("/read_inventory_output", [validateJWT], ctrl.read_inventory_output);
router.delete("/delete_inventory/:id", [validateJWT], ctrl.delete_inventory);

module.exports = router;
