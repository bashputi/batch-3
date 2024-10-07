import { Router } from "express";
import validationRequest from "../../middleware/validationRequest";
import { AuthControllers } from "./auth.controller";
import { UserValidation } from "./auth.validation";
import auth from "../../middleware/Auth";
import { user_role } from "./auth.constant";


const router = Router();
router.post(
    "/signup",
    validationRequest(UserValidation.createUserValidationSchema),
    AuthControllers.registerUser
);
router.post("/signin", AuthControllers.userLogin);
router.post("/forget_password", AuthControllers.userForgetPassword);
router.post("/reset_password", AuthControllers.userResetPassword);
router.get("/", auth(user_role.admin), AuthControllers.getAllUser);
router.get("/:userId", auth(user_role.admin), AuthControllers.getSingleuser);
router.patch("/:userId", AuthControllers.updateSingleUser);



export const AuthRoute = router;