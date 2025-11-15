import { startServer } from './api/server.js';
import { engineService } from './api/services/engine.service.js';
import { downloadService } from './api/services/download.service.js';
import { CleanupFetchProvider } from './engine/platform/FetchProvider.js';
import { config, validateConfig } from './config/settings.js';
import { logger } from './config/logger.js';
import { promises as fs } from 'fs';

/**
 * Initialize required directories
 */
async function initializeDirectories(): Promise<void> {
    const directories = [
        config.storage.root,
        config.storage.downloads,
        config.storage.temp,
        config.storage.database,
        config.storage.cache,
        'logs',
    ];

    for (const dir of directories) {
        await fs.mkdir(dir, { recursive: true });
    }
}

/**
 * Main application initialization
 */
async function main(): Promise<void> {
    try {
        // Validate configuration
        validateConfig();

        // Initialize directories
        await initializeDirectories();

        logger.info('🎌 HakuNeko API Starting...');
        logger.info(`📂 Storage: ${config.storage.root}`);

        // Initialize HakuNeko engine
        await engineService.initialize();

        // Start cleanup interval for old downloads
        setInterval(
            () => {
                downloadService.cleanupOldDownloads().catch((error) => {
                    logger.error('Failed to cleanup old downloads:', error);
                });
            },
            24 * 60 * 60 * 1000
        ); // Run daily

        // Start API server
        await startServer();
    } catch (error) {
        logger.error('Failed to start application:', error);
        process.exit(1);
    }
}

/**
 * Graceful shutdown
 */
async function shutdown(): Promise<void> {
    logger.info('🛑 Shutting down gracefully...');

    try {
        // Cleanup Puppeteer resources
        await CleanupFetchProvider();

        logger.info('👋 Shutdown complete');
        process.exit(0);
    } catch (error) {
        logger.error('Error during shutdown:', error);
        process.exit(1);
    }
}

// Handle shutdown signals
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start application
main();
