import { z } from "zod";


const timeSchema = z.string().refine(
    (time) => {
        const regex = /^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):([0-5]\d)$/;
        return regex.test(time);
    },
    {
        message: "invalid time formet, expected ISO 8601 format 'YYYY-MM-DDTHH:MM'!" 
    }
);

export const BookingFromSchema = z.object({
    nidOrPassport: z.string().min(1, "NID or Passport number is required"),
    drivingLicense: z.string().min(1, "Driving license is required"),
    cardNumber: z.string().min(1, "Card number is required"),
    exprirationDate: z.string().min(1, "Expiration date is required"),
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
        isBooked: z.enum(["unconfirmed", "confirmed", "canceled"]).optional(),
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
        isBooked: z.enum(["unconfirmed", "confirmed", "canceled"]).optional(),
        payment: BookingFromSchema,
    }),
});

export const bookedValidation = {
    newBookedValidationSchema,
    updateBookedValidationSchema,
};