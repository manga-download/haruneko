import { Router } from 'express';
import { asyncHandler } from '../middleware/error-handler.js';
import * as downloadsController from '../controllers/downloads.js';
import { validate, schemas } from '../middleware/validator.js';

const router = Router();

/**
 * POST /api/v1/downloads
 * Create new download request
 */
router.post(
    '/',
    validate(schemas.downloadRequest, 'body'),
    asyncHandler(downloadsController.createDownload)
);

/**
 * GET /api/v1/downloads
 * Get all downloads with status
 */
router.get(
    '/',
    validate(schemas.paginationQuery, 'query'),
    asyncHandler(downloadsController.getAllDownloads)
);

/**
 * GET /api/v1/downloads/:downloadId
 * Get specific download status
 */
router.get(
    '/:downloadId',
    validate(schemas.downloadIdParam, 'params'),
    asyncHandler(downloadsController.getDownload)
);

/**
 * GET /api/v1/downloads/:downloadId/file
 * Download the completed file
 */
router.get(
    '/:downloadId/file',
    validate(schemas.downloadIdParam, 'params'),
    asyncHandler(downloadsController.downloadFile)
);

/**
 * DELETE /api/v1/downloads/:downloadId
 * Cancel/remove download
 */
router.delete(
    '/:downloadId',
    validate(schemas.downloadIdParam, 'params'),
    asyncHandler(downloadsController.deleteDownload)
);

export default router;
