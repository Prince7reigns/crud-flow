import express from "express"
import cookieParser from "cookie-parser"
import {errorHandler,noFounHandler} from './src/middlewares/error.middleware.js'
import routes from './src/routes/index.route.js'

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use("/api/v1",routes)

app.use(noFounHandler)
app.use(errorHandler)

export default app