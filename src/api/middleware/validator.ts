import { z, type ZodSchema } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { Errors } from './error-handler.js';

/**
 * Validation schemas
 */
export const schemas = {
    // Download request
    downloadRequest: z.object({
        sourceId: z.string().min(1, 'Source ID is required'),
        mangaId: z.string().min(1, 'Manga ID is required'),
        chapterIds: z.array(z.string()).min(1, 'At least one chapter ID is required'),
        format: z.enum(['cbz', 'pdf', 'epub', 'images']).default('cbz'),
        options: z.object({
            quality: z.enum(['low', 'medium', 'high']).optional(),
            includeMetadata: z.boolean().optional(),
        }).optional(),
    }),

    // Search query
    searchQuery: z.object({
        q: z.string().optional(),
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().max(100).default(20),
        sort: z.enum(['title', 'updated', 'popular']).optional(),
        order: z.enum(['asc', 'desc']).default('asc'),
    }),

    // Pagination query
    paginationQuery: z.object({
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().max(100).default(20),
    }),

    // URL parameters
    sourceIdParam: z.object({
        sourceId: z.string().min(1),
    }),

    mangaIdParam: z.object({
        sourceId: z.string().min(1),
        mangaId: z.string().min(1),
    }),

    downloadIdParam: z.object({
        downloadId: z.string().uuid(),
    }),
};

/**
 * Validate request against schema
 */
export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            const data = source === 'body' ? req.body : source === 'query' ? req.query : req.params;
            const validated = schema.parse(data);

            // Replace the original data with validated data
            if (source === 'body') req.body = validated;
            else if (source === 'query') req.query = validated as typeof req.query;
            else req.params = validated as typeof req.params;

            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const details = error.errors.reduce((acc, err) => {
                    const path = err.path.join('.');
                    acc[path] = err.message;
                    return acc;
                }, {} as Record<string, string>);

                next(Errors.ValidationError(details));
            } else {
                next(error);
            }
        }
    };
}
