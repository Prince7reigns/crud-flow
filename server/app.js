import express from "express"

const app = express()

import healthcheckRouter from './src/routes/healthcheck.route.js'

app.use("/api/v1/healthcheck", healthcheckRouter)

export default app