import {Router} from "express";
import authenticator from "authenticator";
import {client} from "@repo/db/client";
import jwt from "jsonwebtoken";
import sendMessage from "../../utils/twilio.js";


const router:Router = Router();

//this is it , this is the end 
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

        var otp  = authenticator.generateToken(number + process.env.HASH_ADDED);
        console.log('generated otp------------>',otp);
        const production = process.env.NODE_ENV === 'production';
        if (1 == 1){
            //only in production send otp
            try{
                var otp  = authenticator.generateToken(number + process.env.HASH_ADDED);
                await sendMessage(`Your otp for login is ${otp}`,number);
                res.status(200).json({msg:"msg sent success"});
                return;
            }catch(e){
                res.status(500).json({msg:"Internal server error",error:e});
                console.log(e);
                return;
            }
            
        }
        res.status(200).json({id:user.id});

    }catch(err){
        console.log("Error found in use singup controller",err);
        res.status(500).json({msg:"Internal Server Erro"});
    } 
    //authenticator.verifyToken(formattedKey, formattedToken);
    // { delta: 0 }
});

router.post("/signup/verify",async (req,res)=>{
    try{
        const {otp,number,name} = req.body;
        //otp and number , name all are strings
        if(!authenticator.verifyToken(number+process.env.HASH_ADDED, otp)){
            const user = await client.user.update({ //this returns the user id 
                where:{
                    number:number
                },
                data:{
                    name:name,
                    verified:true
                }
            })
            //set users jwt token :todo
            const token =jwt.sign(user,process.env.JWT_SECRET!);
            res.status(200).json({
                token:token,
                userId:user
            });
            return;
        }else{
            res.status(400).json({msg:"Invalid token or expired"});
            return;
        }
            
    }catch(err){
        console.log("Error in signup verificatin controller",err);
        res.status(500).json({msg:"Internal Server Error"});
        return;
    }
});


export default router;