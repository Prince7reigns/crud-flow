import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from '../utils/Apiresponse.js';

const healthCheck = asyncHandler((req,res)=> sendSuccess(res,{status:201,message:"Server is running and everything is O.k"}))

export default healthCheck;