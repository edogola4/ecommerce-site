import { Response } from 'express';
import { ApiResponse } from '../types/interfaces';

export class ResponseUtils {
  /**
   * Send success response
   */
  public static success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200,
    meta?: any
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      ...(meta && { meta })
    };
    
    return res.status(statusCode).json(response);
  }

  /**
   * Send error response
   */
  public static error(
    res: Response,
    message: string = 'Internal Server Error',
    statusCode: number = 500,
    error?: string
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      ...(error && { error })
    };
    
    return res.status(statusCode).json(response);
  }

  /**
   * Send validation error response
   */
  public static validationError(
    res: Response,
    errors: string[] | string,
    message: string = 'Validation Error'
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      error: Array.isArray(errors) ? errors.join(', ') : errors
    };
    
    return res.status(400).json(response);
  }

  /**
   * Send unauthorized response
   */
  public static unauthorized(
    res: Response,
    message: string = 'Unauthorized'
  ): Response {
    return this.error(res, message, 401);
  }

  /**
   * Send forbidden response
   */
  public static forbidden(
    res: Response,
    message: string = 'Forbidden'
  ): Response {
    return this.error(res, message, 403);
  }

  /**
   * Send not found response
   */
  public static notFound(
    res: Response,
    message: string = 'Resource not found'
  ): Response {
    return this.error(res, message, 404);
  }

  /**
   * Send conflict response
   */
  public static conflict(
    res: Response,
    message: string = 'Conflict'
  ): Response {
    return this.error(res, message, 409);
  }

  /**
   * Send paginated response
   */
  public static paginated<T>(
    res: Response,
    data: T[],
    total: number,
    page: number,
    limit: number,
    message: string = 'Success'
  ): Response {
    const totalPages = Math.ceil(total / limit);
    
    const response: ApiResponse<T[]> = {
      success: true,
      message,
      data,
      meta: {
        total,
        page,
        limit,
        pages: totalPages
      }
    };
    
    return res.status(200).json(response);
  }
}