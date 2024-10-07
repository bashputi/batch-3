import httpStatus from "http-status";
import catchAsync from "../../utilits/catchAsync";
import sendResponce from "../../utilits/sendResponce";
import { AuthService } from "./auth.service";



const registerUser = catchAsync(async (req, res) => {
    const result = await AuthService.register(req.body);
    sendResponce(res, {
        statusCode: 201,
        success: true,
        message: "User registered successfully!",
        data: result,
    })
});

const userLogin = catchAsync(async (req, res) => {
    const { accessRefreshToken, token, user } = await AuthService.loginUser(
        req.body
    );

    res.cookie("refreshToken", accessRefreshToken, {
        httpOnly: true,
        secure: true,
    });

    sendResponce(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully!",
        data: { user, token },
    });
});


const userForgetPassword = catchAsync(async (req, res) => {
    const {name, email} = await AuthService.forgetPassword( req.body );
    
    sendResponce(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Hello ${name}, a password reset link has been sent to your email address. Please check your ${email} to reset your password.`,
        data: {} ,
    });
});

const userResetPassword = catchAsync(async (req, res) => {
    const result = await AuthService.userPasswordReset(req.body);

    sendResponce(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password reset successfully!',
        data: result,
    });
});

const getAllUser = catchAsync(async (req, res) => {
    const result = await AuthService.getAllUser();

    sendResponce(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All user retrived successfully!',
        data: result,
    });
});

const getSingleuser = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const result = await AuthService.getSingleUser(userId);

    sendResponce(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All users are retrived successfully!',
        data: result,
    });
});

const updateSingleUser = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const result = await AuthService.updateUser(userId, req.body);

    sendResponce(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User update successfully!',
        data: result,
    });
});

export const AuthControllers = {
    registerUser,
    userLogin,
    userForgetPassword,
    userResetPassword,
    getAllUser,
    getSingleuser,
    updateSingleUser,
}