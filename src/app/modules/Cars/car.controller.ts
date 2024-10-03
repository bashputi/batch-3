import { Car } from './car.model';
import httpStatus from "http-status";
import catchAsync from "../../utilits/catchAsync";
import sendResponce from "../../utilits/sendResponce";
import { CarService } from "./car.service";
import AppError from '../../Error/AppError';



const createACar = catchAsync(async (req, res) => {
    
    const result = await CarService.createCar(req.body);
    sendResponce(res, {
        statusCode: 201,
        success: true,
        message: "Car created successfully",
        data: result,
    });
});

const getAllCars = catchAsync(async (req, res) => {
    const { search = '', type= '', sortByPrice = 'asc', page = 1, limit = 8 } = req.query;
    const result = await CarService.GetAllCar(
        search as string,
        type as string,
        sortByPrice as 'asc' | 'desc',
        Number(page),
        Number(limit)
    );
    if ( result.cars.length > 0) {
        sendResponce(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Car retrived successfully",
            data: result,
        });
    } else {
        throw new AppError(httpStatus.NOT_FOUND, "No Data Found");
    }
  
});

const getCar = catchAsync(async (req, res) => {
    const { id } = req.params;
 
    const result = await CarService.getSingleCar(id);
    sendResponce(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "A car retrived successfully",
        data: result,
    });
});

const updateACar = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CarService.updateCar(id, req.body);
    sendResponce(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Car update successfully",
        data: result,
    });
});

const deleteACar = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CarService.deleteCar(id, req.body);
    sendResponce(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Car delete successfully",
        data: result,
    });
});



export const CarController = {
    createACar,
    getAllCars,
    getCar,
    updateACar,
    deleteACar,
}