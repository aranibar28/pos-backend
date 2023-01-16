const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const ctrl = require("../controllers/kpi");
const router = Router();

//[ http://localhost:3000/api/kpi ]
router.get("/kpi_widgets", [validateJWT], ctrl.kpi_widgets);
router.get("/kpi_earnings", [validateJWT], ctrl.kpi_earnings);
router.get("/kpi_top_products", [validateJWT], ctrl.kpi_top_products);
router.get("/kpi_type_sales", [validateJWT], ctrl.kpi_type_sales);

module.exports = router;
