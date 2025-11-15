import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import type { DownloadRequest, DownloadStatus } from '../types/responses.js';
import { engineService } from './engine.service.js';
import { config } from '../../config/settings.js';
import { Errors } from '../middleware/error-handler.js';
import { logger } from '../../config/logger.js';

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

            // Enqueue chapters for download
            const downloadManager = engineService.getDownloadManager();
            // Note: Casting to any due to type complexity
            await downloadManager.Enqueue(...chaptersToDownload as any);

            // Wait for downloads to complete
            // TODO: Implement proper status tracking from DownloadManager
            await this.waitForDownloadCompletion(chaptersToDownload, downloadId);

            // Create final archive/export
            await this.createExport(downloadId, request);

            this.updateDownloadStatus(downloadId, {
                status: 'completed',
                progress: 100,
                completedAt: new Date().toISOString(),
                fileUrl: `/api/v1/downloads/${downloadId}/file`,
            });
        } catch (error) {
            logger.error(`Download processing failed for ${downloadId}:`, error);
            throw error;
        }
    }

    /**
     * Wait for download completion
     * TODO: Implement proper status tracking
     */
    private async waitForDownloadCompletion(chapters: any[], downloadId: string): Promise<void> {
        // This is a simplified version
        // In production, you'd want to track actual download progress
        const totalChapters = chapters.length;
        let completedChapters = 0;

        // Simulate progress updates
        // TODO: Hook into actual DownloadTask status updates
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                completedChapters++;
                const progress = Math.floor((completedChapters / totalChapters) * 100);

                this.updateDownloadStatus(downloadId, {
                    progress,
                    currentChapter: chapters[completedChapters - 1]?.Title,
                });

                if (completedChapters >= totalChapters) {
                    clearInterval(interval);
                    resolve();
                }
            }, 2000); // Update every 2 seconds
        });
    }

    /**
     * Create export file
     */
    private async createExport(_downloadId: string, request: DownloadRequest): Promise<string> {
        // TODO: Implement actual export using engine's exporters
        const fileName = `${request.mangaId}_${Date.now()}.${request.format || 'cbz'}`;
        const filePath = path.join(this.downloadDir, fileName);

        // For now, create a placeholder file
        // In production, this would use the actual exporter from the engine
        await fs.writeFile(filePath, 'Download completed', 'utf-8');

        return filePath;
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

        // Find the file
        const files = await fs.readdir(this.downloadDir);
        const file = files.find((f) => f.includes(download.mangaId));

        if (!file) {
            throw Errors.NotFound('Download file');
        }

        return path.join(this.downloadDir, file);
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

        for (const [id, download] of this.downloads.entries()) {
            const createdAt = new Date(download.createdAt).getTime();

            if (now - createdAt > retentionMs) {
                await this.deleteDownload(id);
            }
        }
    }
}

// Export singleton instance
export const downloadService = new DownloadService();
