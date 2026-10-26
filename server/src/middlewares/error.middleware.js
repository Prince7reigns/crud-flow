import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";
import { env } from '../config/env.js';

export const errorHandler = (err,req,res,next)=>{
    let error=err;

    // Convert known library errors into ApiError
1
    if(err instanceof ZodError){
        const errors=err.issues.map((i)=>({field:i.path.join('.'),message:i.message}));
        error = new ApiError(400,'validation failed',errors);
    }else if(err.name==='CastError'){
        error =  new ApiError(400,`invalid ${err.path}:${err.value}`);
    }else if(err.name==='ValidationError'){
        const errors = Object.values(err.errors).map((e)=>({field:e.path,message:e.message}));
        error = new ApiError(400,'Validation failed',errors)
    }else if(err.code===11000){
        const field = Object.keys(err.keyValue)[0];
        error=new ApiError(409,`${field} already exists`);
    }else if(err.name==='JsonWebTokenError'){
        error=new ApiError(401,'Invalid token')
    }else if(err.name==='TokenExpiredError'){
        error=new ApiError(401,'Token expired')
    }else if(!(err instanceof ApiError)){
        error=new ApiError(500,'Internal server error') //hide unknown details
        error.isOperational=false;
    }

    //Log real bugs not expected errors
    if(!error.isOperational) console.error(err);

    res.status(error.statusCode).json({
        success:false,
        message:error.message,
        errors:error.errors,
        ...(env.NODE_ENV!=='profuction' && {stack:err.stack}),
    })
}

export const noFounHandler=(req,res,next)=> next(new ApiError(404,`Route not found: ${req.method} ${req.originalUrl}`));