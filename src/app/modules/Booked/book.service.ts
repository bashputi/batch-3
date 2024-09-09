import mongoose from "mongoose";
import { User } from "../Auth/auth.model";
import AppError from "../../Error/AppError";
import httpStatus from "http-status";
import { Car } from "../Cars/car.model";
import { Booked } from "./book.model";
import { calculationTotalDurationTime } from "./book.utlils";




interface TBooked extends Document {
    carId: mongoose.Types.ObjectId;
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
        throw new AppError(httpStatus.NOT_FOUND, "car not found");
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

    const result = (
        await (await Booked.create(payload)).populate("user")
    ).populate("carId");
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
        const { bookingId } = payload;
        const findBook = await Booked.findOne({ _id: bookingId });
        if(!findBook) {
            throw new AppError(httpStatus.NOT_FOUND, "Bookings are not Found");
        }

        const { carId } = findBook;

        const findCar = await Car.findByIdAndUpdate(
            { _id: carId },
            { status: "available" },
            { new: true, runValidators: true }
        );
        if (!findCar) {
            throw new AppError(httpStatus.NOT_FOUND, "Bookings are not Found");
        }

        const { pricePerHour } = findCar;
        const filterBooked = await Booked.findByIdAndUpdate(id, payload, session);

        if(!filterBooked) {
            throw new AppError(httpStatus.NOT_FOUND, "Bookings are not Found");
        }
        const { startTime, endTime } = filterBooked;

        const filterTotalCost = calculationTotalDurationTime(
            startTime,
            endTime as string,
            pricePerHour,
        );

        payload.totalCost = filterTotalCost;
        const result = await Booked.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
        }).populate("user").populate("carId");

        await session.commitTransaction();
        await session.endSession();
        return result;

    } catch (error) {
        await session.abortTransaction();
         session.endSession()
         throw error;
    }
};



export const BookedService = {
    newBookedIntoDB,
    getAllBookedFromDB,
    getSingleBookedFromDB,
    getMyBookedFromDB,
    returnBookedIntoDB,
};