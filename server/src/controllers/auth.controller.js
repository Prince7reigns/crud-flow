import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signAccessToken,signRefreshToken,hashToken,setRefreshCookie, clearRefreshCookie, verifyRefreshToken } from "../utils/tokens.js";


const issueTokens = async (user, res) => {
  const refresh = signRefreshToken(user._id);
  user.refreshTokenHash = hashToken(refresh);
  await user.save({ validateBeforeSave: false });
  setRefreshCookie(res, refresh);
  return signAccessToken(user._id);
};



export const registerUser = asyncHandler(async(req,res)=>{
    const {name,email,password} = req.valid.body

    if(await User.exists({email}) ) throw ApiError.conflict('Email already registered')

    const user = await User.create({ name,email,password })

    const accessToken = await issueTokens(user,res)

    sendSuccess(res,{status:201, message:"User successfully registered!!!" , data:{user,accessToken}})
})

export const loginUser = asyncHandler(async(req,res)=>{
  const { email,password } = req.valid.body

  const user = await User.findOne({ email }).select("+password");

  if(!user || !(await user.comparePassword(password)) ) throw ApiError.unauthorized("Invalid email or password")

  const accessToken = await issueTokens(user,res)

  sendSuccess(res,{message:"User successfully logged in",data:{user,accessToken}})

})

export const refresh = asyncHandler(async(req,res)=>{
    const token = req.cookies.refreshToken;

    if(!token) throw ApiError.unauthorized("No refresh token")

    const payload = verifyRefreshToken(token)

    const user = await User.findById(payload.id).select("+refreshTokenHash")

    if(!user || user.refreshTokenHash !== hashToken(token)){
      if(user){
        user.refreshTokenHash=undefined;
        await user.save({ validateBeforeSave:false })
      }
      clearRefreshCookie(res)
      throw ApiError.unauthorized("Session expired, please log in again")
    }

     const accessToken = await issueTokens(user,res)

     sendSuccess(res,{message:"User successfully logged in",data:{user,accessToken}})
})

export const logoutUser= asyncHandler(async(req,res)=>{
   const token = req.cookies.refreshToken

   if(token){
    try {
      const { id } = verifyRefreshToken(token)
      await User.findByIdAndUpdate(id,{ $unset:{refreshTokenHash: 1 }})
    } catch (error) {
      clearRefreshCookie(res)
      throw error
    }
   }

   clearRefreshCookie(res)
   sendSuccess(res,{ message:"User logged out" })
})

export const me = asyncHandler(async(req,res)=>{
  sendSuccess(res,{data:{ user: req.user }})
})