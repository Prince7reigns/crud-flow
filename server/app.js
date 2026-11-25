import "dotenv/config"
import express from "express"
import cookieParser from "cookie-parser"
import {errorHandler,noFounHandler} from './src/middlewares/error.middleware.js'
import routes from './src/routes/index.route.js'

const app = express()

const clientOrigin = process.env.CLIENT_URL

app.use((req, res, next) => {
  const origin = req.get("Origin")

  if (origin) res.vary("Origin")
  if (origin && origin === clientOrigin) {
    res.set("Access-Control-Allow-Origin", origin)
    res.set("Access-Control-Allow-Credentials", "true")
  }

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS")
    res.set("Access-Control-Allow-Headers", "Content-Type,Authorization")
    return res.sendStatus(204)
  }

  next()
})

app.use(express.json())
app.use(cookieParser())

app.use("/api/v1",routes)

app.use(noFounHandler)
app.use(errorHandler)

export default app