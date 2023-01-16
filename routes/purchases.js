const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const ctrl = require("../controllers/purchase");
const router = Router();

router.post("/create_purchase", [validateJWT], ctrl.create_purchase);
router.get("/read_purchases", [validateJWT], ctrl.read_purchases);
router.get("/read_purchases_by_id/:id", [validateJWT], ctrl.read_purchases_by_id);
router.put("/read_purchases_by_dates/:from/:to", [validateJWT], ctrl.read_purchases_by_dates);

module.exports = router;
