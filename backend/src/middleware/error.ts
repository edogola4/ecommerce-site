import { Request, Response, NextFunction } from 'express';
import { ResponseUtils } from '../utils/response';

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    user: req.user?.email || 'Anonymous'
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    ResponseUtils.error(res, 'Resource not found', 404);
    return;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    ResponseUtils.conflict(res, message);
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val: any) => val.message).join(', ');
    ResponseUtils.validationError(res, message);
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    ResponseUtils.unauthorized(res, 'Invalid token');
    return;
  }

  if (err.name === 'TokenExpiredError') {
    ResponseUtils.unauthorized(res, 'Token expired');
    return;
  }

  // MongoDB connection errors
  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    ResponseUtils.error(res, 'Database connection error', 503);
    return;
  }

  // Default error
  ResponseUtils.error(
    res,
    error.message || 'Internal Server Error',
    error.statusCode || 500
  );
};

/**
 * 404 handler middleware
 */
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  ResponseUtils.notFound(res, `Route ${req.originalUrl} not found`);
};

/**
 * Async error handler wrapper
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};