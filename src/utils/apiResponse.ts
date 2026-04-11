import { Response } from 'express';
import { HTTP_STATUS } from '../constants/api';

interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

interface ApiErrorResponse {
  success: false;
  error: string;
  statusCode: number;
  details?: Record<string, any>;
}

/**
 * Standardized API response helper
 */
export class ApiResponse {
  /**
   * Send a success response
   */
  static success<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode: number = HTTP_STATUS.OK
  ): Response {
    const response: ApiSuccessResponse<T> = {
      success: true,
      data,
    };
    if (message) {
      response.message = message;
    }
    return res.status(statusCode).json(response);
  }

  /**
   * Send a success response with just a message (no data)
   */
  static message(
    res: Response,
    message: string,
    statusCode: number = HTTP_STATUS.OK
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
    });
  }

  /**
   * Send an error response
   */
  static error(
    res: Response,
    error: string,
    statusCode: number = HTTP_STATUS.INTERNAL_ERROR,
    details?: Record<string, any>
  ): Response {
    const response: ApiErrorResponse = {
      success: false,
      error,
      statusCode,
    };
    if (details) {
      response.details = details;
    }
    return res.status(statusCode).json(response);
  }

  /**
   * Send a 400 Bad Request error
   */
  static badRequest(res: Response, error: string, details?: Record<string, any>): Response {
    return this.error(res, error, HTTP_STATUS.BAD_REQUEST, details);
  }

  /**
   * Send a 401 Unauthorized error
   */
  static unauthorized(res: Response, error: string = 'Non autorisé'): Response {
    return this.error(res, error, HTTP_STATUS.UNAUTHORIZED);
  }

  /**
   * Send a 404 Not Found error
   */
  static notFound(res: Response, error: string): Response {
    return this.error(res, error, HTTP_STATUS.NOT_FOUND);
  }

  /**
   * Send a 409 Conflict error
   */
  static conflict(res: Response, error: string): Response {
    return this.error(res, error, HTTP_STATUS.CONFLICT);
  }

  /**
   * Send a 500 Internal Server Error
   */
  static internal(res: Response, error: string = 'Erreur interne du serveur'): Response {
    return this.error(res, error, HTTP_STATUS.INTERNAL_ERROR);
  }
}

export type { ApiSuccessResponse, ApiErrorResponse };
