const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const ctrl = require("../controllers/sale");
const router = Router();

router.post("/create_sale", [validateJWT], ctrl.create_sale);
router.get("/read_sales", [validateJWT], ctrl.read_sales);
router.get("/read_sales_by_id/:id", [validateJWT], ctrl.read_sales_by_id);
router.put("/read_sales_by_dates/:from/:to", [validateJWT], ctrl.read_sales_by_dates);

module.exports = router;
