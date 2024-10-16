import mongoose from "mongoose";

export const usersModel = mongoose.model(
    'User',
    new mongoose.Schema({
        first_name: {
            type: String,
        },
        last_name: {
            type: String
            },
        email: {
            type: String,
            unique: true,
            required: true
        },
        age: {
            type: Number
        },
        password: {
            type: String,
            required: true
        },
        cart: {
            type:String
        },
        role: {
            type: String,
            default: 'user'
        }
    },
{
    timestamps: true,
    strict: false
}));
