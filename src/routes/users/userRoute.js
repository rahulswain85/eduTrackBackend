import { Router } from "express";
import {
  studentRegister,
  studentLogin,
  studentLogout,
  refreshAccessToken,
} from "../../controllers/user.controller.js";
import { verifyToken } from "../../middlewares/middleware.js";

const router = Router();

router.route("/register").post(studentRegister);
router.route("/login").post(studentLogin);
router.route("/logout").post(verifyToken, studentLogout);
router.route("/refresh-token").post(refreshAccessToken);

export default router;
