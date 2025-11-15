import type { Request, Response } from 'express';
import { downloadService } from '../services/download.service.js';
import type { ApiResponse, DownloadRequest, DownloadStatus } from '../types/responses.js';
import { promises as fs } from 'fs';
import path from 'path';
import archiver from 'archiver';

/**
 * Create new download request
 */
export async function createDownload(req: Request, res: Response): Promise<void> {
    const request: DownloadRequest = req.body;

    const download = await downloadService.createDownload(request);

    const response: ApiResponse<DownloadStatus> = {
        success: true,
        data: download,
    };

    res.status(201).json(response);
}

/**
 * Get all downloads
 */
export async function getAllDownloads(req: Request, res: Response): Promise<void> {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);

    const downloads = downloadService.getAllDownloads();

    // Paginate results
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedDownloads = downloads.slice(startIndex, endIndex);

    const response: ApiResponse<DownloadStatus[]> = {
        success: true,
        data: paginatedDownloads,
        meta: {
            page: pageNum,
            limit: limitNum,
            total: downloads.length,
            totalPages: Math.ceil(downloads.length / limitNum),
        },
    };

    res.json(response);
}

/**
 * Get specific download status
 */
export async function getDownload(req: Request, res: Response): Promise<void> {
    const { downloadId } = req.params;

    const download = downloadService.getDownload(downloadId);

    const response: ApiResponse<DownloadStatus> = {
        success: true,
        data: download,
    };

    res.json(response);
}

/**
 * Download the completed file
 */
export async function downloadFile(req: Request, res: Response): Promise<void> {
    const { downloadId } = req.params;

    const filePath = await downloadService.getDownloadFilePath(downloadId);
    const download = downloadService.getDownload(downloadId);

    // Set appropriate content type
    const contentTypes: Record<string, string> = {
        cbz: 'application/vnd.comicbook+zip',
        pdf: 'application/pdf',
        epub: 'application/epub+zip',
        images: 'application/zip',
    };

    res.setHeader('Content-Type', contentTypes[download.format] || 'application/octet-stream');
    res.setHeader(
        'Content-Disposition',
        `attachment; filename="${download.mangaId}.${download.format}"`
    );

    // Check if it's a directory (images format)
    const stats = await fs.stat(filePath);

    if (stats.isDirectory()) {
        // Create a zip archive on-the-fly for directories
        const archive = archiver('zip', {
            zlib: { level: 0 }, // No compression for already compressed images
        });

        archive.on('error', (err) => {
            throw err;
        });

        // Pipe archive to response
        archive.pipe(res);

        // Add all files from the directory
        archive.directory(filePath, false);

        // Finalize the archive
        await archive.finalize();
    } else {
        // Send file directly for non-directory formats
        res.sendFile(filePath);
    }
}

/**
 * Cancel/remove download
 */
export async function deleteDownload(req: Request, res: Response): Promise<void> {
    const { downloadId } = req.params;

    await downloadService.deleteDownload(downloadId);

    const response: ApiResponse = {
        success: true,
    };

    res.json(response);
}
