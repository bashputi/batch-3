import { Schema, model } from "mongoose";
import { TCar } from "./car.interfase";

const carSchema = new Schema<TCar>(
    {
        name: { type: String, required: true },
        type: { type: String, required: true },
        description: { type: String, required: true },
        color: { type: String, required: true },
        isElectric: { type: String, required: true },
        features: { type: [String], required: true },
        image: { type: String, required: true },
        pricePerHour: { type: Number },
        status: {
          type: String,
          required: true,
          enum: ["available", "unavailable"],
          default: "available",
        },
        isDeleted: { type: Boolean, default: false },
      },
      {
        timestamps: true,
      }  
);
carSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true }});
    next();
});
carSchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true }});
    next();
});

export const Car = model<TCar>("Car", carSchema);