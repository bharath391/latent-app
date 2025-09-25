import jwt, { JwtPayload } from "jsonwebtoken";
import {Request,Response,NextFunction} from "express";
import {client} from "@repo/db/client";

const auth = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const jwt_token = req.cookies.jwt_token;
        if(!jwt_token){
            res.status(400).json({msg:"jwt_token Missing , re-login"});
            return;
        }
        const payload = jwt.verify(jwt_token,process.env.JWT_SECRET!) as JwtPayload;
        if(payload && payload.userId){
            const user = await client.user.findFirst({
                where:{
                    id:payload.userId
                }
            });
            if(!user){
                res.status(404).json({msg:"User not found"});
                return;
            }
            req.user = user;
            next();
        }else{
            res.status(404).json({msg:"Invalid or Expired jwt_token"});
        }
    }catch(e){
        res.status(500).json({msg:"Internal Server Error"});
        return;
    }
};


export default auth;