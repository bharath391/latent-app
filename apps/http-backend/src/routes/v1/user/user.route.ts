import auth from "../middleware/user.auth.js";
import userController from "./user.controller.js";
import {Router} from "express";

const router:Router = Router();

router.post("/signup",userController.signup);
router.post("/signup/verify",userController.verify);
router.get("/profile",auth,userController.profile);

export default router;