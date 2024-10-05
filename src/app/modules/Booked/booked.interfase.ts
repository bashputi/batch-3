import { Types } from "mongoose";


export type TBookingForm = {
    cvv: string;
    cardNumber: string;
    startTime: string;
    exprirationDate: string;
    drivingLicense: string;
    nidOrPassport: string;
}

export type TBook = {
    date?: string;
    user?: Types.ObjectId;
    carId?: Types.ObjectId;
    products?: string;
    totalCost?: number;
    status?: 'Pending' | 'Confirmed' | 'Cancelled';
    paymentStatus?: 'Pending' | 'Paid';
    transactionId?: string;
    endTime?: string;
    isBooked?: "unconfirmed" | "confirmed";
    isDeleted?: boolean;
    payment: TBookingForm;
}