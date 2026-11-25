import { z } from "zod";

const taskFields = {
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(1000),
  status: z.enum(["todo", "in-progress", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.coerce.date().nullable(),
};

const taskBody = z.object({
  title: taskFields.title,
  description: taskFields.description.optional(),
  status: taskFields.status.optional(),
  priority: taskFields.priority.optional(),
  dueDate: taskFields.dueDate.optional(),
});

export const createTaskSchema = z.object({
  body: taskBody.required({ title: true }),
});

export const updateTaskSchema = z.object({
  body: taskBody.partial().refine((body) => Object.keys(body).length > 0, {
    message: "At least one task field must be provided",
  }),
  params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid task id") }),
});

export const taskIdSchema = z.object({
  params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid task id") }),
});

export const listTasksSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    status: taskFields.status.optional(),
    priority: taskFields.priority.optional(),
    search: z.string().trim().max(100).optional(),
    sortBy: z.enum(["createdAt", "updatedAt", "dueDate", "priority", "status"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  }),
});
