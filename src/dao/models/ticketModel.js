import mongoose from "mongoose";

export const ticketModel=mongoose.model(
    "tickets", 
    new mongoose.Schema(
        {
            nroComp: String, 
            fecha: Date, 
            email_comprador: String,
            total: Number, 
            detalle:{
                type:[]
            }
        },
        {timestamps:true}
    )
)