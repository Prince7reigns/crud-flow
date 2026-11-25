import {ApiError} from "../utils/ApiError.js"

export const validate = (schema) => (req,_res,next) =>{
    const result = schema.safeParse({
        body:req.body,
        query:req.query,
        params:req.params,
    });

    if(!result.success){
        const errors = result.error.issues.map((i)=>({
            field:i.path.slice(1).join('.'),
            message:i.message,
        }))
        return next(ApiError.badRequest('Validation failed',errors))
    }

    req.valid = result.data;
    next();
}