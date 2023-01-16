const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const ctrl = require("../controllers/business");
const router = Router();

router.post("/create_business", [validateJWT], ctrl.create_business);
router.get("/read_business", [validateJWT], ctrl.read_business);
router.get("/read_business_config", [validateJWT], ctrl.read_business_config);
router.get("/read_business_by_id/:id", [validateJWT], ctrl.read_business_by_id);
router.put("/update_business/:id", [validateJWT], ctrl.update_business);
router.put("/update_business_config/:id", [validateJWT], ctrl.update_business_config);
router.delete("/delete_business/:id", [validateJWT], ctrl.delete_business);

module.exports = router;
