import express from "express"
import cookieParser from "cookie-parser"

const app = express()

app.use(express.json())
app,use(cookieParser())

import healthcheckRouter from './src/routes/healthcheck.route.js'

app.use("/api/v1/healthcheck", healthcheckRouter)

export default app