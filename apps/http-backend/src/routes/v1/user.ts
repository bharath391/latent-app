import {Router} from "express";
import authenticator from "authenticator";
import {client} from "@repo/db/client";
import jwt from "jsonwebtoken";
import sendMessage from "../../utils/twilio.js";


const router:Router = Router();

router.post("/signup",async (req,res)=>{
    try{
        const number = req.body.phoneNumber;
        if (!number){
            res.status(400).json({msg:"Please provide your phone number"});
            return;
        }
        const user = await client.user.upsert({
            where:{
                number:number
            },
            create:{
                number:number
            },
            update:{
                number:number
            }
        })
        //send this otp to phone number :todo only in production mode
        const production = process.env.NODE_ENV === 'production';
        const otp = (production) ? authenticator.generateToken(number + process.env.HASH_ADDED) : "000000";
        console.log('generated otp------------>',otp); 
        await sendMessage(`your otp for login is ${otp}`,number);
        res.status(200).json({msg:"msg sent success"}); 
        return;
    }catch(err){
        console.log("Error found in use signup controller",err);
        res.status(500).json({msg:"Internal Server Erro"});
    } 
});

router.post("/signup/verify",async (req,res)=>{
    try{
        const {otp,phoneNumber,name} = req.body;
        //otp and number , name all are strings
        const user = await client.user.findFirst({
            where:{
                number:phoneNumber
            }
        })
        if(!user){
            res.status(404).json({msg:"User not found"});
            return;
        }
        if(authenticator.verifyToken(phoneNumber+process.env.HASH_ADDED, otp)){
            const user = await client.user.update({ //this returns the user id 
                where:{
                    number:phoneNumber
                },
                data:{
                    name:name,
                    verified:true
                }
            })
            //set users jwt token :todo
            const token =jwt.sign(user,process.env.JWT_SECRET!);
            res.cookie('access_token', token, {
                httpOnly: true, // Prevents client-side script access
                secure: process.env.NODE_ENV === 'production', // Use secure in production (HTTPS)
                maxAge: 3600000*7*24, // Cookie expires in 7 days(in milliseconds)
                //same site ? ::check
                path: '/' // Cookie is valid for all paths
            });
            res.status(200).json({
                msg:"login successful",
                userId:user
            });
            return;
        }else{
            res.status(400).json({msg:"Invalid token or expired"});
            return;
        }
            
    }catch(err){
        console.log("Error in signup verification controller",err);
        res.status(500).json({msg:"Internal Server Error"});
        return;
    }
});


export default router;