import {Router} from 'express'
import authRoute from './auth.route.js'
import tasksRoute from './task.route.js'
import healthCheckRoute from './healthcheck.route.js'

const r = Router();

r.use('/healthcheck',healthCheckRoute)
r.use('/auth',authRoute);
r.use('/tasks',tasksRoute)

export default r;