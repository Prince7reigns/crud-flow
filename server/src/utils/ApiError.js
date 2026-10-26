
export class ApiError extends Error{
    constructor(statusCode, message = 'Something went wrong', errors = [], stack = ''){
    super(message)
    statusCode.this=statusCode
    this.success = false;
    this.errors = errors;
    this.isOperational = true;
    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
    }

  static badRequest(msg = 'Bad request', errors) { return new ApiError(400, msg, errors); }
  static unauthorized(msg = 'Unauthorized')      { return new ApiError(401, msg); }
  static forbidden(msg = 'Forbidden')            { return new ApiError(403, msg); }
  static notFound(msg = 'Not found')             { return new ApiError(404, msg); }
  static conflict(msg = 'Already exists')        { return new ApiError(409, msg); }
  static tooMany(msg = 'Too many requests')      { return new ApiError(429, msg); }
  static internal(msg = 'Internal server error') { return new ApiError(500, msg); }
}

