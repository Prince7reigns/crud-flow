import { Task } from "../models/task.model.js";
import { ApiError } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({
    ...req.valid.body,
    owner: req.user._id,
  });

  sendSuccess(res, { status: 201, message: "Task created", data: { task } });
});

export const listTasks = asyncHandler(async (req, res) => {
  const { page, limit, status, priority, search, sortBy, sortOrder } = req.valid.query;
  const filter = { owner: req.user._id };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const searchPattern = new RegExp(escapedSearch, "i");
    filter.$or = [{ title: searchPattern }, { description: searchPattern }];
  }

  const sortDirection = sortOrder === "asc" ? 1 : -1;
  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .sort({ [sortBy]: sortDirection, _id: sortDirection })
      .skip((page - 1) * limit)
      .limit(limit),
    Task.countDocuments(filter),
  ]);

  sendSuccess(res, {
    data: { tasks },
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.valid.params.id, owner: req.user._id });

  if (!task) throw ApiError.notFound("Task not found");

  sendSuccess(res, { data: { task } });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.valid.params.id, owner: req.user._id },
    { $set: req.valid.body },
    { returnDocument: "after", runValidators: true },
  );

  if (!task) throw ApiError.notFound("Task not found");

  sendSuccess(res, { message: "Task updated", data: { task } });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.valid.params.id,
    owner: req.user._id,
  });

  if (!task) throw ApiError.notFound("Task not found");

  sendSuccess(res, { message: "Task deleted", data: { task } });
});
