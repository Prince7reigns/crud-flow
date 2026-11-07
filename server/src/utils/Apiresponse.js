// utils/ApiResponse.js
// export class ApiResponse {
//   constructor(statusCode, data = null, message = 'Success') {
//     this.statusCode = statusCode;
//     this.success = statusCode < 400;
//     this.message = message;
//     this.data = data;
//   }
// }

export const sendSuccess = (res, { status = 200, message = 'OK', data = null, meta } = {}) =>
  res.status(status).json({ success: true, message, data, ...(meta && { meta }) });