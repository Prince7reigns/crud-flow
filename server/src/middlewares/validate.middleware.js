import { _parse } from "zod/v4/core"
import {ApiError} from "../utils/ApiError.js"

export const validate = (schema) => (req,_res,next) =>{
    const result = schema.safeParse({
        body:req.body,
        query:req.query,
        params:req.params,
    });

    if(!result.success){
        const errors = result.error.issues.map((i)=>({
            feild:i.path.slice(1).join('.'),
            message:i.message,
        }))
        return next(ApiError.badRequest('valdation failed',errors))
    }

    req.valid = result.data;
    next();
}