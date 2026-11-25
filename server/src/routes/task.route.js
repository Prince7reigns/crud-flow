import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  updateTask,
} from "../controllers/task.controller.js";
import {
  createTaskSchema,
  listTasksSchema,
  taskIdSchema,
  updateTaskSchema,
} from "../validators/task.validator.js";

const r = Router();

r.use(protect);
r.route("/")
  .get(validate(listTasksSchema), listTasks)
  .post(validate(createTaskSchema), createTask);
r.route("/:id")
  .get(validate(taskIdSchema), getTask)
  .patch(validate(updateTaskSchema), updateTask)
  .delete(validate(taskIdSchema), deleteTask);

export default r;