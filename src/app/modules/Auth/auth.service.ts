import jwt from 'jsonwebtoken';
import { accesstoken } from './auth.utlils';
import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import { TUser, TUserLogin} from "./auth.interfase";
import { User } from "./auth.model";
import config from '../../config';
import { resetPasswordEmail } from '../../utilits/sendEmail';


const register = async (payload: TUser) => {
    const user = await User.findOne({ email: payload.email });

    if(user) {
        throw new AppError(httpStatus.CONFLICT, "User already exists!");
    }
    payload.role = payload.role;
    const newuser = await User.create(payload);
    return newuser;
}

const loginUser = async (payload: TUserLogin) => {
    const user = await User.isUserExistByCustomerId(payload.email);
  
    if (!user) {
      throw new AppError(httpStatus.NOT_EXTENDED, "This User not found");
    }
    if (!(await User.isPasswordMatched(payload.password, user.password))) {
      throw new AppError(httpStatus.FORBIDDEN, "wrong password !");
    }
  
    const jwtPayload = {
      email: user.email,
      role: user.role,
      name: user.name,
      phone: user.phone,
      address: user.address,
      _id: user._id
    };

    const accessToken = accesstoken(
        jwtPayload,
        config.jwt_access_token as string,
        "7d"
    );
    const token = `${accessToken}`;

    const accessRefreshToken = accesstoken(
        jwtPayload,
        config.jwt_refresh_token as string,
        "1y"
    );

    return {
        token,
        accessRefreshToken,
        user
    };
};

const forgetPassword = async (payload: TUserLogin) => {
    const user = await User.findOne({ email: payload.email });

    if(!user) {
        throw new AppError(httpStatus.CONFLICT, "User not exists!");
    }
    const id = user._id;
    const name = user.name;
    const email = user.email;

    const jwtPayload = {
        email: user.email,
        role: user.role,
      };
  
      const accessToken = accesstoken(
          jwtPayload,
          config.jwt_access_token as string,
          "7d"
      );
      const token = `${accessToken}`;

      const url = config.URL;
      const URL = `${url}/reset_password/${id}/${token}`;

       resetPasswordEmail(email, URL, name );


    return {
        name, email
    };
};

const userPasswordReset = async (payload: { id: string; token: string; password: string; }) => {
    
    const user = await User.findOne({ _id: payload.id });

    if(!user) {
        throw new AppError(httpStatus.CONFLICT, "User not exists!");
    }

    const token = payload?.token;
    const id = payload?.id;
    const password = payload?.password ;
    const secretKey = config.jwt_access_token as string;

    jwt.verify(token, secretKey, async(error: any, decoded: any) => {
        if (error) {
            throw new AppError(httpStatus.CONFLICT, "Invalid access token!");
        } else {
            const result = await User.updatePassword(id, password);
           return result;
        }
    })

};

const getAllUser = async () => {
    const result = await User.find();
    return result;
};

const getSingleUser = async (id: string) => {
    const result = await User.findById(id);
    return result;
};

const updateUser = async ( id: string, payload: TUser ) => {
    const result = await User.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    })
    return result;
}

export const AuthService = {
    register,
    loginUser,
    forgetPassword,
    userPasswordReset,
    getAllUser,
    getSingleUser,
    updateUser,
};