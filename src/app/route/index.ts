import { BookedRoute } from '../modules/Booked/book.route';
import { CarRoute } from '../modules/Cars/car.route';
import { paymentRoute } from '../modules/payment/payment.route';
import { AuthRoute } from './../modules/Auth/auth.route';
import { Router } from "express";



const router = Router();
const modulesRoute = [
    {
        path: "/auth",
        route: AuthRoute
    },
    {
        path: "/cars",
        route: CarRoute
    },
    {
        path: "/bookings",
        route: BookedRoute
    },
    {
        path: "/payment",
        route: paymentRoute
    }
];

modulesRoute.forEach((route) => router.use(route.path, route.route));
export default router;