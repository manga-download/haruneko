import type { Request, Response, NextFunction } from 'express';
import type { ApiResponse, ApiError } from '../types/responses.js';
import { logger } from '../../config/logger.js';

/**
 * Custom API Error class
 */
export class APIError extends Error {
    constructor(
        public code: string,
        message: string,
        public statusCode: number = 500,
        public details?: Record<string, unknown>
    ) {
        super(message);
        this.name = 'APIError';
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Common API errors
 */
export const Errors = {
    NotFound: (resource: string) =>
        new APIError('NOT_FOUND', `${resource} not found`, 404),

    BadRequest: (message: string, details?: Record<string, unknown>) =>
        new APIError('BAD_REQUEST', message, 400, details),

    ValidationError: (details: Record<string, unknown>) =>
        new APIError('VALIDATION_ERROR', 'Request validation failed', 400, details),

    SourceNotFound: (sourceId: string) =>
        new APIError('SOURCE_NOT_FOUND', `Manga source '${sourceId}' not found`, 404),

    MangaNotFound: (mangaId: string) =>
        new APIError('MANGA_NOT_FOUND', `Manga '${mangaId}' not found`, 404),

    ChapterNotFound: (chapterId: string) =>
        new APIError('CHAPTER_NOT_FOUND', `Chapter '${chapterId}' not found`, 404),

    DownloadNotFound: (downloadId: string) =>
        new APIError('DOWNLOAD_NOT_FOUND', `Download '${downloadId}' not found`, 404),

    DownloadFailed: (reason: string) =>
        new APIError('DOWNLOAD_FAILED', `Download failed: ${reason}`, 500),

    CloudflareBlocked: (url: string) =>
        new APIError('CLOUDFLARE_BLOCKED', `Access blocked by Cloudflare for ${url}`, 403),

    RateLimitExceeded: () =>
        new APIError('RATE_LIMIT_EXCEEDED', 'Too many requests', 429),

    InternalError: (message: string) =>
        new APIError('INTERNAL_ERROR', message, 500),
};

/**
 * Global error handler middleware
 */
export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    // Log error
    logger.error('API Error:', {
        error: err.message,
        code: err instanceof APIError ? err.code : 'UNKNOWN_ERROR',
        path: req.path,
        method: req.method,
        stack: err.stack,
    });

    // Prepare error response
    const statusCode = err instanceof APIError ? err.statusCode : 500;
    const error: ApiError = {
        code: err instanceof APIError ? err.code : 'INTERNAL_ERROR',
        message: err.message || 'An unexpected error occurred',
        details: err instanceof APIError ? err.details : undefined,
    };

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
        error.stack = err.stack;
    }

    const response: ApiResponse = {
        success: false,
        error,
    };

    res.status(statusCode).json(response);
}

/**
 * 404 handler
 */
export function notFoundHandler(req: Request, res: Response): void {
    const response: ApiResponse = {
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: `Route ${req.method} ${req.path} not found`,
        },
    };
    res.status(404).json(response);
}

/**
 * Async handler wrapper to catch promise rejections
 */
export function asyncHandler<T = unknown>(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
