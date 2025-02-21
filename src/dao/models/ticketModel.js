import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const ticketSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            unique: true,
            required: true,
            default: () => uuidv4()
        },
        purchase_datetime: {
            type: Date,
            default: Date.now,
        },
        purchaser: {
            type: String,
            required: true, 
        },
        amount: {
            type: Number,
            required: true,
        },
        detalle: {
            type: Array,
            default: [], 
        },
    },
    { timestamps: true } 
);

export const ticketModel = mongoose.model("tickets", ticketSchema);