import { Router } from 'express';
import { asyncHandler } from '../middleware/error-handler.js';
import * as sourcesController from '../controllers/sources.js';
import { validate, schemas } from '../middleware/validator.js';

const router = Router();

/**
 * GET /api/v1/sources
 * Get all manga sources
 */
router.get(
    '/',
    validate(schemas.paginationQuery, 'query'),
    asyncHandler(sourcesController.getAllSources)
);

/**
 * GET /api/v1/sources/:sourceId
 * Get specific manga source details
 */
router.get(
    '/:sourceId',
    validate(schemas.sourceIdParam, 'params'),
    asyncHandler(sourcesController.getSource)
);

/**
 * GET /api/v1/sources/:sourceId/search
 * Search manga in specific source
 */
router.get(
    '/:sourceId/search',
    validate(schemas.sourceIdParam, 'params'),
    validate(schemas.searchQuery, 'query'),
    asyncHandler(sourcesController.searchManga)
);

/**
 * GET /api/v1/sources/:sourceId/manga
 * List all manga from source (paginated)
 */
router.get(
    '/:sourceId/manga',
    validate(schemas.sourceIdParam, 'params'),
    validate(schemas.paginationQuery, 'query'),
    asyncHandler(sourcesController.listManga)
);

/**
 * GET /api/v1/sources/:sourceId/manga/:mangaId
 * Get manga details
 */
router.get(
    '/:sourceId/manga/:mangaId',
    validate(schemas.mangaIdParam, 'params'),
    asyncHandler(sourcesController.getManga)
);

/**
 * GET /api/v1/sources/:sourceId/manga/:mangaId/chapters
 * Get manga chapters
 */
router.get(
    '/:sourceId/manga/:mangaId/chapters',
    validate(schemas.mangaIdParam, 'params'),
    asyncHandler(sourcesController.getChapters)
);

export default router;
