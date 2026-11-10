import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { protect } from "../middlewares/auth.middleware.js"
import { registerSchema,loginSchema} from '../validators/auth.validator.js';
import { registerUser,loginUser,refresh,logoutUser, me } from "../controllers/auth.controller.js";


const router = Router()

router.post('/register', validate(registerSchema), registerUser)
router.post('/login', validate(loginSchema), loginUser)
router.post('/logout', logoutUser)
router.post('/refresh',refresh)
router.post('/me', protect, me);


export default router;