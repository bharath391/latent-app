import {Router} from "express";
import userRouter from "./user/user.route.js";
import adminRouter from "./admin/admin.route.js";


const router:Router = Router();


router.use('/user',userRouter);
router.use('/admin',adminRouter);


export default router;