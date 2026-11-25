import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from '../utils/Apiresponse.js';

const healthCheck = asyncHandler((_req,res)=> sendSuccess(res,{message:"Server is running and everything is OK"}))

export default healthCheck;