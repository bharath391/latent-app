//admins can only signin ,since admin phone num is already injected to db**
import {Router} from "express";
import adminController from "./admin.controller.js";
import adminAuth from "../middleware/admin.auth.js";
const router:Router = Router();

router.post("/signin",adminController.signin);
router.post("/verify",adminController.verify);
router.get("/profile",adminAuth,adminController.profile);

export default router;