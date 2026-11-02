import jwt from 'jsonwebtoken'
import crypto from 'crypto'


export const signAccessToken = (id) => jwt.sign({id},process.env.JWT_ACCESS_SECRET,{expiresIn:'15m'})
export const signRefreshToken = (id) => jwt.sign({id},process.env.JWT_REFRESH_SECRET,{expiresIn:'7d'})
export const verifyAccessToken = (token) => jwt.verify(token,process.env.JWT_ACCESS_SECRET)
export const verifyRefreshToken = (token) => jwt.verify(token,process.env.JWT_REFRESH_SECRET)

export const hashToken = (t) => crypto.createHash('sha256').update(t).digest('hex')

const cookieOpts = {
    httpOnly:true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/api/v1/auth',
}

export const setRefreshCookie = (res,token) => res.cookie('refreshToken',token,{...cookieOpts,maxAge: 7 * 24 * 60 * 60 * 1000 })
export const clearRefreshCookie =(res) => res.clearCookie('refreshToken',cookieOpts)