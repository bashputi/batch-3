import { Router } from "express";
import auth from "../../middleware/Auth";
import { user_role } from "../Auth/auth.constant";
import validationRequest from "../../middleware/validationRequest";
import { CarValidation } from "./car.validation";
import { CarController } from "./car.controller";
import { BookedController } from "../Booked/booked.controller";



const router = Router();

router.post("/", auth(user_role.admin), validationRequest(CarValidation.createCarValidationSchema), CarController.createACar);
router.get("/:id", CarController.getCar);

router.put("/return", auth(user_role.admin), validationRequest(CarValidation.updateCarValidationSchema), BookedController.returnBooked);

router.patch("/:id", auth(user_role.admin), validationRequest(CarValidation.updateCarValidationSchema), CarController.updateACar);
router.delete("/:id", auth(user_role.admin), validationRequest(CarValidation.updateCarValidationSchema), CarController.deleteACar);
router.get("/", CarController.getAllCars);

export const CarRoute = router;