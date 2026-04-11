import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { HTTP_STATUS } from '../constants/api';

interface CustomError extends Error {
  status?: number;
  statusCode?: number;
}

/**
 * Centralized error handling middleware
 */
export function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  // Log the error for debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Determine status code
  const statusCode = err.status || err.statusCode || HTTP_STATUS.INTERNAL_ERROR;

  // Determine error message
  let message = err.message || 'Erreur interne du serveur';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return ApiResponse.badRequest(res, 'Données invalides', { details: err.message });
  }

  if (err.name === 'UnauthorizedError') {
    return ApiResponse.unauthorized(res, 'Non autorisé');
  }

  if (statusCode === HTTP_STATUS.NOT_FOUND) {
    return ApiResponse.notFound(res, message);
  }

  // Default error response
  return ApiResponse.error(res, message, statusCode);
}