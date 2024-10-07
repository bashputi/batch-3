import { z } from "zod";
import { user_role } from "./auth.constant";


const createUserValidationSchema = z.object({
    body: z.object({
        name: z.string({
          required_error: "Name is required",
          invalid_type_error: "Name must be a string",
        }),
        email: z
          .string({
            required_error: "Email is required",
            invalid_type_error: "Email must be a string",
          })
          .email(),
        role: z.nativeEnum(user_role, {
          required_error: "Role is required",
          invalid_type_error: "Role must be a string",
        }),
        password: z.string({
          required_error: "password is required",
          invalid_type_error: "Password must be a string",
        }),
        phone: z
          .string({
            required_error: "Number is required",
          })
          .min(1, "Number is required"),
        address: z.string({ required_error: "Address is required" }),
      }),
});

const updateUserValidationSchema = z.object({
    body: z.object({
        name: z.string({
          required_error: "Name is required",
          invalid_type_error: "Name must be a string",
        }).optional(),
        email: z
          .string({
            required_error: "Email is required",
            invalid_type_error: "Email must be a string",
          })
          .email().optional(),
        role: z.nativeEnum(user_role, {
          required_error: "Role is required",
          invalid_type_error: "Role must be a string",
        }).optional(),
        password: z.string({
          required_error: "password is required",
          invalid_type_error: "Password must be a string",
        }),
        phone: z
          .string({
            required_error: "Number is required",
          })
          .min(1, "Number is required").optional(),
        address: z.string({ required_error: "Address is required" }).optional(),
      }),
});

export const UserValidation = {
    createUserValidationSchema,
    updateUserValidationSchema,
};