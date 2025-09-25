import {NextFunction, Request, Response } from 'express';
import {client} from "@repo/db/client";
import jwt,{JwtPayload} from "jsonwebtoken";

const auth = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const jwt_token = req.cookies.jwt_token;
        if(!jwt_token){
            res.status(400).json({msg:"jwt_token Missing or expired re-login"});
            return;
        }
        const payload = jwt.verify(jwt_token,process.env.JWT_SECRET!) as JwtPayload;
        if(payload && payload.adminId){
            const admin = await client.admin.findFirst({
                where:{
                    id:payload.adminId
                }
            });
            if(!admin){
                res.status(404).json({msg:"Admin not found"});
                return;
            }
            req.admin = admin;
            next();
        }else{
            res.status(404).json({msg:"Invalid or Expired jwt_token"});
        }
    }catch(e){
        res.status(500).json({msg:"Internal Server Error"});
        console.log("Error in adminAuth.controller","error-------->",e);
        return;
    }
};


export default auth;