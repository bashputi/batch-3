import { z } from "zod";


const timeSchema = z.string().refine(
    (time) => {
        const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        return regex.test(time);
    },
    {message: '"invalid time formet expexted HH.MM in 24 hour format" !'}
);

export const BookingFromSchema = z.object({
    nidOrPassport: z.string().min(1, "NID or Passport number is required"),
    drivingLicense: z.string().min(1, "Driving license is required"),
    cardNumber: z.string().min(1, "Card number is required"),
    expirationDate: z.string().min(1, "Expiration date is required"),
    cvv: z.string().min(1, "CVV is required"),
    startTime: timeSchema,
});

const newBookedValidationSchema = z.object({
    body: z.object({
        payment: BookingFromSchema,
        user: z.string().optional(),
        carId: z.string(),
        endTime: timeSchema.optional(),
        totalCost: z.number().optional(),
        isBooked: z.enum(["unconfirmed", "confirmed"]).optional(),
    }),
});

const updateBookedValidationSchema = z.object({
    body: z.object({
        date: z.string().optional(),
        user: z.string().optional(),
        carId: z.string().optional(),
        startTime: timeSchema.optional(),
        endTime: timeSchema,
        totalCost: z.number().optional(),
        isBooked: z.enum(["unconfirmed", "confirmed"]).optional(),
        payment: BookingFromSchema,
    }),
});

export const bookedValidation = {
    newBookedValidationSchema,
    updateBookedValidationSchema,
};