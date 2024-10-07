import { Schema, model } from "mongoose";

import bcryptjs from "bcryptjs";
import config from "../../config";
import { TUser, UserModel } from "./auth.interfase";
import { user_role } from "./auth.constant";

const UserSchema = new Schema<TUser, UserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true, enum: Object.keys(user_role) },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    status: {
      type: String, enum: ["Block", "Active"], default: "Active"
    }
  },
  { timestamps: true }
);

// hash password
UserSchema.pre("save", async function (next) {
  const user = this;
  user.password = await bcryptjs.hash(
    user.password,
    Number(config.bcrypt_salt_round)
  );
  next();
});

UserSchema.post("save", async function (doc, next) {
  doc.password = "";
  next();
});

UserSchema.statics.updatePassword = async function (id: string, password: string) {
  const hashedPassword = await bcryptjs.hash(password, Number(config.bcrypt_salt_round));

  return await this.findByIdAndUpdate(
    id,
    { password: hashedPassword },
    { new: true, runValidators: true }
  ).select("+password");
};

UserSchema.statics.isUserExistByCustomerId = async function (email: string) {
  return await User.findOne({ email }).select("+password");
};
UserSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  heshTextPassword
) {
  return await bcryptjs.compare(plainTextPassword, heshTextPassword);
};
// Create and export the User model
export const User = model<TUser, UserModel>("User", UserSchema);