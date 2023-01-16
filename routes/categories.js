const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const ctrl = require("../controllers/category");
const router = Router();

router.post("/create_category", [validateJWT], ctrl.create_category);
router.get("/read_categories", [validateJWT], ctrl.read_categories);
router.get("/read_all_categories", [validateJWT], ctrl.read_all_categories);
router.get("/read_category_by_id/:id", [validateJWT], ctrl.read_category_by_id);
router.put("/update_category/:id", [validateJWT], ctrl.update_category);
router.put("/delete_category/:id", [validateJWT], ctrl.delete_category);

module.exports = router;
