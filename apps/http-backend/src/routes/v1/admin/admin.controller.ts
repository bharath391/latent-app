import {Request,Response} from "express";
import {client} from "@repo/db/client";
import authenticator from "authenticator";
import jwt from "jsonwebtoken";
import sendMessage from "../../../utils/twilio.js";

class AdminController{
    signin = async (req:Request,res:Response) => {
        try{
            const {number} = req.body;
            //check or find this number in  admin table
            if(!number){
                res.status(400).json({msg:"Missing Phone Number"});
                return;
            }
            const admin = await client.admin.findFirst({
                where:{
                    number:number
                }
            });

            if(!admin){
                res.status(404).json({msg:"Admin account not found or wrong number"});
                return;
            }
            //generate otp for admin and send it using twilio
            const key = process.env.HASH_ADDED;
            const otp = authenticator.generateToken(number+key!);
            if(process.env.NODE_ENV === "production"){
                //use twilio
                await sendMessage(`your otp for login is ${otp}`,number);
                res.status(200).json({msg:"msg sent"});
            }else{
                //send otp in res , so that i can verify it 
                res.status(200).json({otp:otp});
            }
            return;

        }catch(e){
            res.status(500).json({msg:"Internal Server Error"});
            console.log(e);
            return;
        }

    };

    verify = async(req:Request,res:Response) => {
        try{
            const {number,otp} = req.body;
            const key = process.env.HASH_ADDED;
            if(authenticator.verifyToken(number+key!,otp)){
                const admin = await client.admin.findFirst({
                    where:{
                        number:number
                    },
                    
                })
                //assign jwt to admin  TODO:convert this to refresh token later
                const jwt_token = jwt.sign({adminId:admin!.id},process.env.JWT_SECRET!);
                res.cookie('jwt_token', jwt_token, {
                    httpOnly: true, // Prevents client-side script access
                    secure: process.env.NODE_ENV === 'production', // Use secure in production (HTTPS)
                    maxAge: 3600000*7*24, // Cookie expires in 7 days(in milliseconds)
                    //same site ? ::check
                    path: '/' // Cookie is valid for all paths
                });
                res.status(200).json({
                    msg:"login successful",
                    adminId:admin
                });
                return;
            }
            res.status(400).json({msg:"Invalid Otp"});
            return;
        }catch(e){
            res.status(500).json({msg:"Internal Server Error"});
            return;
        }

    };

    profile = async (req:Request,res:Response) =>{
        try{
            res.status(200).json({admin:req.admin});
            return 
        }catch(e){
            console.log('Error in admin profile controller ',"error----->",e);
            res.status(500).json({msg:"Internal Server Error"});
            return;
        }
    };

}
onst adminController = new AdminController();


export default adminController;