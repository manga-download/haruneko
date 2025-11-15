import type { Request, Response } from 'express';
import { engineService } from '../services/engine.service.js';
import type { ApiResponse, SourceInfo, MangaInfo, ChapterInfo, SearchQuery } from '../types/responses.js';
import { logger } from '../../config/logger.js';

/**
 * Get all manga sources
 */
export async function getAllSources(req: Request, res: Response): Promise<void> {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);

    const sources = engineService.getAllSources();

    // Paginate results
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedSources = sources.slice(startIndex, endIndex);

    const response: ApiResponse<SourceInfo[]> = {
        success: true,
        data: paginatedSources,
        meta: {
            page: pageNum,
            limit: limitNum,
            total: sources.length,
            totalPages: Math.ceil(sources.length / limitNum),
        },
    };

    res.json(response);
}

/**
 * Get specific source details
 */
export async function getSource(req: Request, res: Response): Promise<void> {
    const { sourceId } = req.params;

    const source = engineService.getSource(sourceId);

    const response: ApiResponse<SourceInfo> = {
        success: true,
        data: source,
    };

    res.json(response);
}

/**
 * Search manga in specific source
 */
export async function searchManga(req: Request, res: Response): Promise<void> {
    const { sourceId } = req.params;
    const { q = '', page = 1, limit = 20 } = req.query as SearchQuery;
    const pageNum = Number(page);
    const limitNum = Number(limit);

    logger.info(`🌐 API Request: GET /api/v1/sources/${sourceId}/search`, {
        query: q,
        page: pageNum,
        limit: limitNum,
        ip: req.ip,
        userAgent: req.get('user-agent'),
    });

    const searchStartTime = Date.now();
    const results = await engineService.searchManga(sourceId, q || '');
    const searchDuration = Date.now() - searchStartTime;

    logger.info(`⏱️  Search completed in ${searchDuration}ms, found ${results.length} total results`);

    // Paginate results
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedResults = results.slice(startIndex, endIndex);

    logger.info(`📄 Returning page ${pageNum} with ${paginatedResults.length} results (of ${results.length} total)`);

    const response: ApiResponse<MangaInfo[]> = {
        success: true,
        data: paginatedResults,
        meta: {
            page: pageNum,
            limit: limitNum,
            total: results.length,
            totalPages: Math.ceil(results.length / limitNum),
        },
    };

    res.json(response);
}

/**
 * List all manga from source
 */
export async function listManga(req: Request, res: Response): Promise<void> {
    const { sourceId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);

    const manga = await engineService.listManga(sourceId);

    // Paginate results
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedManga = manga.slice(startIndex, endIndex);

    const response: ApiResponse<MangaInfo[]> = {
        success: true,
        data: paginatedManga,
        meta: {
            page: pageNum,
            limit: limitNum,
            total: manga.length,
            totalPages: Math.ceil(manga.length / limitNum),
        },
    };

    res.json(response);
}

/**
 * Get manga details
 */
export async function getManga(req: Request, res: Response): Promise<void> {
    const { sourceId, mangaId } = req.params;

    const manga = await engineService.getManga(sourceId, mangaId);

    const response: ApiResponse<MangaInfo> = {
        success: true,
        data: manga,
    };

    res.json(response);
}

/**
 * Get manga chapters
 */
export async function getChapters(req: Request, res: Response): Promise<void> {
    const { sourceId, mangaId } = req.params;

    logger.info(`🌐 API Request: GET /api/v1/sources/${sourceId}/manga/${mangaId}/chapters`, {
        sourceId,
        mangaId,
        ip: req.ip,
        userAgent: req.get('user-agent'),
    });

    const chaptersStartTime = Date.now();
    const chapters = await engineService.getChapters(sourceId, mangaId);
    const chaptersDuration = Date.now() - chaptersStartTime;

    logger.info(`⏱️  Chapters fetch completed in ${chaptersDuration}ms, found ${chapters.length} chapters`);

    const response: ApiResponse<ChapterInfo[]> = {
        success: true,
        data: chapters,
        meta: {
            total: chapters.length,
        },
    };

    res.json(response);
}
