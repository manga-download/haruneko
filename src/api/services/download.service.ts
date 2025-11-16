import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import type { DownloadRequest, DownloadStatus } from '../types/responses.js';
import { engineService } from './engine.service.js';
import { config } from '../../config/settings.js';
import { Errors } from '../middleware/error-handler.js';
import { logger } from '../../config/logger.js';
import { SanitizeFileName } from '../../engine/StorageController.js';
import { NodeComicBookArchiveExporter } from '../exporters/NodeComicBookArchiveExporter.js';
import { NodeImageDirectoryExporter } from '../exporters/NodeImageDirectoryExporter.js';
import { Priority } from '../../engine/taskpool/TaskPool.js';

/**
 * Download service for managing chapter downloads
 */
class DownloadService {
    private downloads = new Map<string, DownloadStatus>();
    private downloadDir = config.storage.downloads;

    constructor() {
        this.ensureDownloadDirectory();
    }

    /**
     * Ensure download directory exists
     */
    private async ensureDownloadDirectory(): Promise<void> {
        await fs.mkdir(this.downloadDir, { recursive: true });
    }

    /**
     * Create a new download
     */
    public async createDownload(request: DownloadRequest): Promise<DownloadStatus> {
        const downloadId = randomUUID();

        const status: DownloadStatus = {
            id: downloadId,
            sourceId: request.sourceId,
            mangaId: request.mangaId,
            chapterIds: request.chapterIds,
            status: 'queued',
            progress: 0,
            format: request.format || 'cbz',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        this.downloads.set(downloadId, status);

        // Start download asynchronously
        this.processDownload(downloadId, request).catch((error) => {
            logger.error(`Download ${downloadId} failed:`, error);
            this.updateDownloadStatus(downloadId, {
                status: 'failed',
                error: error.message,
            });
        });

        return status;
    }

    /**
     * Process a download
     */
    private async processDownload(downloadId: string, request: DownloadRequest): Promise<void> {
        try {
            this.updateDownloadStatus(downloadId, { status: 'downloading' });

            const plugin = engineService.getPluginController().WebsitePlugins.find(
                (p: any) => p.Identifier === request.sourceId
            );

            if (!plugin) {
                throw Errors.SourceNotFound(request.sourceId);
            }

            // Get manga
            const mangas = await plugin.Entries;
            const manga = mangas.Value.find((m: any) => m.Identifier === request.mangaId);

            if (!manga) {
                throw Errors.MangaNotFound(request.mangaId);
            }

            // Get chapters
            const chapters = await manga.Entries;
            const chaptersToDownload = chapters.Value.filter((c: any) =>
                request.chapterIds.includes(c.Identifier)
            );

            if (chaptersToDownload.length === 0) {
                throw new Error('No valid chapters found to download');
            }

            this.updateDownloadStatus(downloadId, {
                status: 'processing',
                progress: 0,
            });

            // Download chapters and create export
            await this.downloadAndExport(downloadId, request, chaptersToDownload, manga.Title);

            this.updateDownloadStatus(downloadId, {
                status: 'completed',
                progress: 100,
                completedAt: new Date().toISOString(),
                fileUrl: `/api/v1/downloads/${downloadId}/file`,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;
            logger.error(`Download processing failed for ${downloadId}:`, {
                error: errorMessage,
                stack: errorStack,
                downloadId,
                sourceId: request.sourceId,
                mangaId: request.mangaId,
            });
            throw error;
        }
    }

    /**
     * Download chapters and create export file
     */
    private async downloadAndExport(downloadId: string, request: DownloadRequest, chapters: any[], mangaTitle: string): Promise<string> {
        const storageController = engineService.getStorageController();
        const format = request.format || 'cbz';

        // Process each chapter
        for (let chapterIndex = 0; chapterIndex < chapters.length; chapterIndex++) {
            const chapter = chapters[chapterIndex];

            logger.info(`Downloading chapter ${chapterIndex + 1}/${chapters.length}: ${chapter.Title}`);
            this.updateDownloadStatus(downloadId, {
                currentChapter: chapter.Title,
                progress: Math.floor((chapterIndex / chapters.length) * 90), // Reserve last 10% for export
            });

            try {
                // Fetch pages for this chapter
                await chapter.Update();
                const pages = chapter.Entries.Value;

                if (pages.length === 0) {
                    logger.warn(`Chapter ${chapter.Title} has no pages, skipping`);
                    continue;
                }

                logger.info(`Fetching ${pages.length} pages for chapter: ${chapter.Title}`);

                // Download all pages and store temporarily
                const resourceMap = new Map<number, string>();
                for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
                    const page = pages[pageIndex];
                    try {
                        logger.debug(`Fetching page ${pageIndex + 1}/${pages.length}: ${page.Link?.href}`);
                        const imageBlob = await page.Fetch(Priority.Normal, new AbortController().signal);
                        logger.debug(`Received blob: type=${imageBlob?.type}, size=${imageBlob?.size}`);

                        const tempKey = await storageController.SaveTemporary(imageBlob);
                        logger.debug(`Saved to temporary storage with key: ${tempKey}`);
                        resourceMap.set(pageIndex, tempKey);

                        // Update progress within chapter
                        const chapterProgress = (chapterIndex + (pageIndex + 1) / pages.length) / chapters.length;
                        this.updateDownloadStatus(downloadId, {
                            progress: Math.floor(chapterProgress * 90),
                        });
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        const errorStack = error instanceof Error ? error.stack : undefined;
                        logger.error(`Failed to download page ${pageIndex + 1} of chapter ${chapter.Title}:`, {
                            error: errorMessage,
                            stack: errorStack,
                            pageLink: page.Link?.href,
                        });
                        throw new Error(`Failed to download page ${pageIndex + 1}: ${errorMessage}`);
                    }
                }

                logger.info(`Successfully downloaded ${resourceMap.size} pages for chapter: ${chapter.Title}`);

                // Create export using appropriate exporter
                const sanitizedMangaId = SanitizeFileName(request.mangaId);
                const sanitizedChapterTitle = SanitizeFileName(chapter.Title);

                let outputPath: string;
                let exporter;

                if (format === 'cbz') {
                    const fileName = `${sanitizedMangaId}_${sanitizedChapterTitle}_${Date.now()}.cbz`;
                    outputPath = path.join(this.downloadDir, fileName);
                    exporter = new NodeComicBookArchiveExporter(storageController);
                } else if (format === 'images') {
                    const dirName = `${sanitizedMangaId}_${sanitizedChapterTitle}_${Date.now()}.images`;
                    outputPath = path.join(this.downloadDir, dirName);
                    exporter = new NodeImageDirectoryExporter(storageController);
                } else {
                    throw new Error(`Unsupported format: ${format}`);
                }

                logger.info(`Exporting to ${format}: ${outputPath}`);

                try {
                    await exporter.Export(resourceMap, outputPath, chapter.Title, mangaTitle);
                    logger.info(`Successfully exported chapter to: ${outputPath}`);
                } finally {
                    // Clean up temporary files
                    const tempKeys = Array.from(resourceMap.values());
                    await storageController.RemoveTemporary(...tempKeys);
                }

                // For now, only download the first chapter
                // TODO: Support multiple chapters in a single download
                return outputPath;

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                const errorStack = error instanceof Error ? error.stack : undefined;
                logger.error(`Failed to process chapter ${chapter.Title}:`, {
                    error: errorMessage,
                    stack: errorStack,
                    chapterTitle: chapter.Title,
                    chapterId: chapter.Identifier,
                });
                throw error;
            }
        }

        throw new Error('No chapters were successfully downloaded');
    }

    /**
     * Get all downloads
     */
    public getAllDownloads(): DownloadStatus[] {
        return Array.from(this.downloads.values());
    }

    /**
     * Get a specific download
     */
    public getDownload(downloadId: string): DownloadStatus {
        const download = this.downloads.get(downloadId);
        if (!download) {
            throw Errors.DownloadNotFound(downloadId);
        }
        return download;
    }

    /**
     * Get download file path
     */
    public async getDownloadFilePath(downloadId: string): Promise<string> {
        const download = this.getDownload(downloadId);

        if (download.status !== 'completed') {
            throw Errors.BadRequest('Download is not completed yet');
        }

        // Find the file or directory using sanitized manga ID
        const sanitizedMangaId = SanitizeFileName(download.mangaId);
        const entries = await fs.readdir(this.downloadDir, { withFileTypes: true });

        // Look for files/directories that match the sanitized manga ID
        const entry = entries.find((e) => e.name.includes(sanitizedMangaId));

        if (!entry) {
            logger.warn(`File/directory not found for download ${downloadId}, looking for: ${sanitizedMangaId}`);
            logger.debug(`Available entries: ${entries.map(e => e.name).join(', ')}`);
            throw Errors.NotFound('Download file');
        }

        const filePath = path.join(this.downloadDir, entry.name);

        // For image directories, we might want to create a zip on-the-fly or return the directory
        // For now, return the path as-is
        return filePath;
    }

    /**
     * Delete a download
     */
    public async deleteDownload(downloadId: string): Promise<void> {
        const download = this.getDownload(downloadId);

        // If completed, delete the file
        if (download.status === 'completed') {
            try {
                const filePath = await this.getDownloadFilePath(downloadId);
                await fs.unlink(filePath);
            } catch (error) {
                logger.warn(`Failed to delete file for download ${downloadId}:`, error);
            }
        }

        // Remove from map
        this.downloads.delete(downloadId);
    }

    /**
     * Update download status
     */
    private updateDownloadStatus(
        downloadId: string,
        updates: Partial<DownloadStatus>
    ): void {
        const download = this.downloads.get(downloadId);
        if (download) {
            Object.assign(download, updates, {
                updatedAt: new Date().toISOString(),
            });
            this.downloads.set(downloadId, download);
        }
    }

    /**
     * Cleanup old downloads
     */
    public async cleanupOldDownloads(): Promise<void> {
        const retentionMs = config.downloads.retentionDays * 24 * 60 * 60 * 1000;
        const now = Date.now();

        const entries = Array.from(this.downloads.entries());
        for (const [id, download] of entries) {
            const createdAt = new Date(download.createdAt).getTime();

            if (now - createdAt > retentionMs) {
                await this.deleteDownload(id);
            }
        }
    }
}

// Export singleton instance
export const downloadService = new DownloadService();
