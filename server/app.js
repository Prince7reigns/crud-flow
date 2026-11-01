import express from "express"

const app = express()

app.use(express.json())

import healthcheckRouter from './src/routes/healthcheck.route.js'

app.use("/api/v1/healthcheck", healthcheckRouter)

export default app