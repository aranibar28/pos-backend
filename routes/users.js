const { Router } = require("express");
const ctrl = require("../controllers/user");
const { validateJWT } = require("../middlewares/authenticated");
const router = Router();

router.post("/login_user", ctrl.login_user);
router.get("/renew_token", [validateJWT], ctrl.renew_token);

router.post("/create_user", [validateJWT], ctrl.create_user);
router.get("/read_users", [validateJWT], ctrl.read_users);
router.get("/read_all_users", [validateJWT], ctrl.read_all_users);
router.get("/read_user_by_id/:id", [validateJWT], ctrl.read_user_by_id);
router.put("/update_user/:id", [validateJWT], ctrl.update_user);
router.delete("/delete_user/:id", [validateJWT], ctrl.delete_user);

module.exports = router;
