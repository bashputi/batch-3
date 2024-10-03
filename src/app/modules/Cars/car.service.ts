
import { TCar } from "./car.interfase";
import { Car } from "./car.model";
import httpStatus from 'http-status';
import AppError from '../../Error/AppError';


const createCar = async (payload: TCar) => {
    const result = await Car.create(payload);
    return result;
};

const GetAllCar = async (search: string, type: string, sortByPrice: 'asc' | 'desc' = 'asc', page: number = 1, limit: number = 10) => {
    const query: any = {};
    if(search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' }},
            { color: { $regex: search, $options: 'i' }}
        ];
    }

    if(type) {
        query.type = type;
    }

    const sortOption = sortByPrice === 'asc' ? 'price' : '-price';
    const skip = (page -1) * limit;

    const cars = await Car.find(query)
    .sort(sortOption)
    .select('id image name pricePerHour status type color price')
    .skip(skip).limit(limit);

    if(!cars) {
        throw new AppError(httpStatus.NOT_FOUND, "No Data Found");
    }

    const total = await Car.countDocuments(query);

    return {
        cars,
        total,
        page,
        pages: Math.ceil(total / limit),
    }
};

const getSingleCar = async (id: string) => {
    const result = await Car.findById(id);
  
    if(!result) {
        throw new AppError(httpStatus.NOT_FOUND, "No Data Found");
    }
    return result;
};

const updateCar = async (id: string, payload: Partial<TCar>) => {
   
    const result = await Car.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });

    if(!result) {
        throw new AppError(httpStatus.NOT_FOUND, "No Data Found");
    }
    return result;
};

const deleteCar = async (id: string, payload: Partial<TCar>) => {
    const result = await Car.findByIdAndUpdate(id, {
        isDeleted: true,
        new: true,
        runValidators: true,
    });
    return result;
}

export const CarService = {
    createCar,
    GetAllCar,
    getSingleCar,
    updateCar,
    deleteCar
}