import { Router } from "express";
import { user_role } from "../Auth/auth.constant";
import auth from "../../middleware/Auth";
import validationRequest from "../../middleware/validationRequest";
import { bookedValidation } from "./book.validation";
import { BookedController } from "./booked.controller";



const router = Router();

router.post(
    "/",
    auth(user_role.user),
    validationRequest(bookedValidation.newBookedValidationSchema),
    BookedController.newBooked
);

router.get('/', auth(user_role.admin), BookedController.getAllOrders);
router.get('/my-bookings', auth(user_role.user), BookedController.getMyOrder);
router.delete("/:bookedId", auth(user_role.user), BookedController.deleteBooked);

export const BookedRoute = router;