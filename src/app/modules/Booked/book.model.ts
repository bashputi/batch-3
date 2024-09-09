import mongoose, { Schema, model } from "mongoose";
import { TBooked } from "./booked.interfase";



const bookedSchema = new Schema<TBooked>(
    {
        date: { type: String, required: [true, "date is requierd"] },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    carId: { type: mongoose.Schema.Types.ObjectId, ref: "car" },
    startTime: { type: String },
    endTime: { type: String, default: null },
    totalCost: { type: Number, default: 0 },
    isBooked: {
      type: String,
      enum: ["unconfirmed", "confirmed"],
      default: "unconfirmed",
    } ,
    },
    {
        timestamps: true,
    }
);

export const Booked = model<TBooked>("Booked", bookedSchema)