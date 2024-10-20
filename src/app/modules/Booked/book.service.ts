import mongoose from "mongoose";
import { User } from "../Auth/auth.model";
import AppError from "../../Error/AppError";
import httpStatus from "http-status";
import { Car } from "../Cars/car.model";
import { Booked } from "./book.model";
import { calculationTotalDurationTime } from "./book.utlils";
import { initialPayment } from "../payment/payment.utils";




interface TBooked extends Document {
    carId?: mongoose.Types.ObjectId;
    user?: mongoose.Types.ObjectId;
    [key: string]: any;
};

const newBookedIntoDB = async (
    user: Record<string, unknown>,
    payload: TBooked
) => {
    const filterLoginUser = await User.findOne({ email: user.email });
    if(!filterLoginUser) {
        throw new AppError(httpStatus.NOT_FOUND, "user not Found");
    }
    const newuser = filterLoginUser._id;
    payload.user = newuser as mongoose.Types.ObjectId;

    const filterCar = await Car.findOne({ _id: payload.carId });
    if(!filterCar) {
        throw new AppError(httpStatus.NOT_FOUND, "Car not found");
    }

    const { _id } = filterCar;
    const statusUpdateCar = await Car.findByIdAndUpdate(
        _id,
        {
            status: "unavailable",
        },
        {
            new: true,
            runValidators: true,
        }
    );

    const result =  (await Booked.create(payload)).populate("user")
    
    return result;
};

const getAllBookedFromDB = async () => {
    const result = await Booked.find().populate("carId").populate("user");
    if(!result.length) {
        throw new AppError(httpStatus.NOT_FOUND, "No Data Found");
    }
    return result;
};

const getSingleBookedFromDB = async (id: string) => {
    const result = await Booked.findById(id);
    if(!result) {
        throw new AppError(httpStatus.NOT_FOUND, "No Data Found");
    }
    return result;
};

const getMyBookedFromDB = async (email: string) => {
    const filter = await User.findOne({ email });
    
    if(!filter) {
        throw new AppError(httpStatus.NOT_FOUND, "User not Found");
    }

    const userId = filter._id;

    const result = await Booked.find({ user: userId }).populate("carId").populate("user");
    if(!result) {
        throw new AppError(httpStatus.NOT_FOUND, "No data Found");
    }
    return result;
};

const returnBookedIntoDB = async (id: string, payload: Record<string, unknown>) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { bookingId, endTime } = payload as {
            bookingId: string;
            endTime: string;
        };
        const findBook = await Booked.findOne({ _id: bookingId }).session(session);
       
        if(!findBook) {
            throw new AppError(httpStatus.NOT_FOUND, "Bookings are not Found");
        }
        const startTime = findBook.payment.startTime;
        const { carId, date } = findBook;

        const startDateTime = new Date(startTime);
        const endDateTime = new Date(endTime);

        const findCar = await Car.findByIdAndUpdate(
            { _id: carId },
            { status: "available" },
            { new: true, runValidators: true, session }
        );
        if (!findCar) {
            throw new AppError(httpStatus.NOT_FOUND, "Bookings are not Found");
        }

        const { pricePerHour } = findCar;

        const filterTotalCost = calculationTotalDurationTime(
            startDateTime.toISOString(),
            endDateTime.toISOString(),
            pricePerHour
        );
        payload.totalCost = filterTotalCost?.toFixed(2);
 

        const filterBooked = await Booked.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
            session
        }).populate('user').populate('carId');

        await session.commitTransaction();
        await session.endSession();
        return filterBooked;

    } catch (error) {
        await session.abortTransaction();
         session.endSession()
         throw error;
    }
};

const deleteBooked = async (id: string) => {
    const result = await Booked.deleteOne({ _id: id });
    return result;
};

const updateBooked = async (id: string) => {
    const result = await Booked.findByIdAndUpdate(
        id,
        {
            isBooked: "confirmed"
        },
        {
            new: true, runValidators: true
        }
    );
    return result;
}

const canceledBooked = async (id: string) => {
    const result = await Booked.findByIdAndUpdate(
        id,
        {
            isBooked: "canceled"
        },
        {
            new: true, runValidators: true
        }
    );
    return result;
}

const orderPayment = async ( payload: any) => {
    const getPayment = payload;
    const id = getPayment._id
    const totalCost = getPayment.totalCost;

    const transactionId = `TXN-${Date.now()}`;
    const order = await Booked.findByIdAndUpdate(
         id,
        {
            user: getPayment.user,
            products: getPayment?.carId?.name,
            totalCost,
            status: 'Pending',
            paymentStatus: 'Pending',
            transactionId,
        }
    );
   

    const paymentData = {
        transactionId,
        totalCost,
        customerName: getPayment?.user?.name,
        customerEmail: getPayment?.user?.email,
        customerPhone: getPayment?.user?.phone,
    };

    const initialState = await initialPayment(paymentData);
    return initialState;
}

export const BookedService = {
    newBookedIntoDB,
    getAllBookedFromDB,
    getSingleBookedFromDB,
    getMyBookedFromDB,
    returnBookedIntoDB,
    deleteBooked,
    updateBooked,
    canceledBooked,
    orderPayment


    
};