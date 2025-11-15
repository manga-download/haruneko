import { HakuNeko } from '../../engine/HakuNeko.js';
import type { MangaPlugin } from '../../engine/providers/MangaPlugin.js';
import type { SourceInfo, MangaInfo, ChapterInfo } from '../types/responses.js';
import { Errors } from '../middleware/error-handler.js';
import { logger } from '../../config/logger.js';

/**
 * Engine service that wraps HakuNeko for API usage
 */
class EngineService {
    private hakuneko: HakuNeko | null = null;
    private initialized = false;

    /**
     * Initialize the HakuNeko engine
     */
    public async initialize(): Promise<void> {
        if (this.initialized) {
            return;
        }

        try {
            logger.info('🚀 Initializing HakuNeko engine...');
            this.hakuneko = new HakuNeko();

            // Initialize with empty frontends array (no UI needed)
            await this.hakuneko.Initialze([]);

            this.initialized = true;
            logger.info(`✅ HakuNeko engine initialized with ${this.getAllSources().length} sources`);
        } catch (error) {
            logger.error('Failed to initialize HakuNeko engine:', error);
            throw Errors.InternalError('Failed to initialize manga engine');
        }
    }

    /**
     * Get HakuNeko instance
     */
    private getEngine(): HakuNeko {
        if (!this.hakuneko || !this.initialized) {
            throw Errors.InternalError('Engine not initialized');
        }
        return this.hakuneko;
    }

    /**
     * Get all manga sources
     */
    public getAllSources(): SourceInfo[] {
        const engine = this.getEngine();
        const plugins = engine.PluginController.WebsitePlugins;

        return plugins.map((plugin: any) => this.mapPluginToSource(plugin));
    }

    /**
     * Get a specific source by ID
     */
    public getSource(sourceId: string): SourceInfo {
        const engine = this.getEngine();
        const plugin = engine.PluginController.WebsitePlugins.find(
            (p: any) => p.Identifier === sourceId
        );

        if (!plugin) {
            throw Errors.SourceNotFound(sourceId);
        }

        return this.mapPluginToSource(plugin);
    }

    /**
     * Search manga in a specific source
     */
    public async searchManga(sourceId: string, query: string): Promise<MangaInfo[]> {
        const engine = this.getEngine();
        const plugin = engine.PluginController.WebsitePlugins.find(
            (p: any) => p.Identifier === sourceId
        );

        if (!plugin) {
            throw Errors.SourceNotFound(sourceId);
        }

        try {
            // For now, get all manga and filter by query
            // TODO: Implement proper search if supported by the plugin
            const mangas = await plugin.Entries;
            const filtered = mangas.Value.filter((manga: any) =>
                manga.Title.toLowerCase().includes(query.toLowerCase())
            );

            return filtered.map((manga: any) => this.mapMangaToInfo(manga, sourceId));
        } catch (error) {
            logger.error(`Error searching manga in ${sourceId}:`, error);
            const message = error instanceof Error ? error.message : 'Unknown error';
            throw Errors.InternalError(`Failed to search manga: ${message}`);
        }
    }

    /**
     * List all manga from a source
     */
    public async listManga(sourceId: string): Promise<MangaInfo[]> {
        const engine = this.getEngine();
        const plugin = engine.PluginController.WebsitePlugins.find(
            (p: any) => p.Identifier === sourceId
        );

        if (!plugin) {
            throw Errors.SourceNotFound(sourceId);
        }

        try {
            const mangas = await plugin.Entries;
            return mangas.Value.map((manga: any) => this.mapMangaToInfo(manga, sourceId));
        } catch (error) {
            logger.error(`Error listing manga from ${sourceId}:`, error);
            const message = error instanceof Error ? error.message : 'Unknown error';
            throw Errors.InternalError(`Failed to list manga: ${message}`);
        }
    }

    /**
     * Get manga details
     */
    public async getManga(sourceId: string, mangaId: string): Promise<MangaInfo> {
        const engine = this.getEngine();
        const plugin = engine.PluginController.WebsitePlugins.find(
            (p: any) => p.Identifier === sourceId
        );

        if (!plugin) {
            throw Errors.SourceNotFound(sourceId);
        }

        try {
            const mangas = await plugin.Entries;
            const manga = mangas.Value.find((m: any) => m.Identifier === mangaId);

            if (!manga) {
                throw Errors.MangaNotFound(mangaId);
            }

            return this.mapMangaToInfo(manga, sourceId);
        } catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                throw error;
            }
            logger.error(`Error getting manga ${mangaId}:`, error);
            const message = error instanceof Error ? error.message : 'Unknown error';
            throw Errors.InternalError(`Failed to get manga: ${message}`);
        }
    }

    /**
     * Get chapters for a manga
     */
    public async getChapters(sourceId: string, mangaId: string): Promise<ChapterInfo[]> {
        const engine = this.getEngine();
        const plugin = engine.PluginController.WebsitePlugins.find(
            (p: any) => p.Identifier === sourceId
        );

        if (!plugin) {
            throw Errors.SourceNotFound(sourceId);
        }

        try {
            const mangas = await plugin.Entries;
            const manga = mangas.Value.find((m: any) => m.Identifier === mangaId);

            if (!manga) {
                throw Errors.MangaNotFound(mangaId);
            }

            const chapters = await manga.Entries;

            return chapters.Value.map((chapter: any) => ({
                id: chapter.Identifier,
                title: chapter.Title,
                mangaId,
                sourceId,
                number: chapter.Number,
                volume: chapter.Volume,
                language: chapter.Language,
            }));
        } catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                throw error;
            }
            logger.error(`Error getting chapters for ${mangaId}:`, error);
            const message = error instanceof Error ? error.message : 'Unknown error';
            throw Errors.InternalError(`Failed to get chapters: ${message}`);
        }
    }

    /**
     * Get download manager
     */
    public getDownloadManager() {
        return this.getEngine().DownloadManager;
    }

    /**
     * Get plugin controller
     */
    public getPluginController() {
        return this.getEngine().PluginController;
    }

    /**
     * Map plugin to source info
     */
    private mapPluginToSource(plugin: any): SourceInfo {
        return {
            id: plugin.Identifier,
            title: plugin.Title,
            url: plugin.URI.href,
            icon: plugin.Icon,
            tags: plugin.Tags.Value.map((tag: any) => tag.Title),
            supportsSearch: true, // Most plugins support search
            supportsList: true, // Most plugins support listing
            status: 'active', // TODO: Implement status checking
        };
    }

    /**
     * Map manga to manga info
     */
    private mapMangaToInfo(manga: any, sourceId: string): MangaInfo {
        return {
            id: manga.Identifier,
            title: manga.Title,
            sourceId,
            url: manga.Identifier, // Usually the URL or unique identifier
        };
    }
}

// Export singleton instance
export const engineService = new EngineService();
