import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../utils/tokens.js";
import {User} from '../models/user.model.js'



export const protect = asyncHandler(async(req,_res,next)=>{
  const header = req.headers.authorization || '';

  if(!header.startsWith('Bearer ')) throw ApiError.unauthorized('Missing Access Token');

  const payload = verifyAccessToken(header.split(' ')[1])

  const user = await User.findById(payload.id);
  if (!user) throw ApiError.unauthorized('User no longer exists');

  req.user=user;
  next()
})