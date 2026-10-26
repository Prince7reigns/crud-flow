import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/Apiresponse.js";

const healthCheck = asyncHandler((req,res)=>{
    return res
           .status(200)
           .json(
            new ApiResponse(200,{message:"Server is running and everything is O.k"},"OK")
           )
})

export default healthCheck;