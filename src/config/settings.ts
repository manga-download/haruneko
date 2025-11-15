import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

/**
 * Application configuration
 */
export const config = {
    // Server
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || '0.0.0.0',
    nodeEnv: process.env.NODE_ENV || 'development',

    // API
    apiPrefix: '/api/v1',
    apiVersion: '1.0.0',

    // CORS
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
    },

    // Rate limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    },

    // Storage paths
    storage: {
        root: process.env.STORAGE_PATH || path.join(__dirname, '../../storage'),
        downloads: path.join(process.env.STORAGE_PATH || path.join(__dirname, '../../storage'), 'downloads'),
        temp: path.join(process.env.STORAGE_PATH || path.join(__dirname, '../../storage'), 'temp'),
        database: path.join(process.env.STORAGE_PATH || path.join(__dirname, '../../storage'), 'database'),
        cache: path.join(process.env.STORAGE_PATH || path.join(__dirname, '../../storage'), 'cache'),
    },

    // Puppeteer
    puppeteer: {
        headless: process.env.PUPPETEER_HEADLESS !== 'false',
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        maxBrowsers: parseInt(process.env.PUPPETEER_MAX_BROWSERS || '5', 10),
        timeout: parseInt(process.env.PUPPETEER_TIMEOUT || '150000', 10), // 2.5 minutes
    },

    // Downloads
    downloads: {
        maxConcurrent: parseInt(process.env.MAX_CONCURRENT_DOWNLOADS || '3', 10),
        defaultFormat: (process.env.DEFAULT_FORMAT || 'cbz') as 'cbz' | 'pdf' | 'epub' | 'images',
        retentionDays: parseInt(process.env.DOWNLOAD_RETENTION_DAYS || '7', 10),
    },

    // Logging
    logging: {
        level: process.env.LOG_LEVEL || 'info',
    },

    // Security
    security: {
        apiKey: process.env.API_KEY,
        requireApiKey: process.env.REQUIRE_API_KEY === 'true',
    },
} as const;

/**
 * Validate configuration
 */
export function validateConfig(): void {
    if (config.security.requireApiKey && !config.security.apiKey) {
        throw new Error('API_KEY must be set when REQUIRE_API_KEY is true');
    }

    if (config.port < 1 || config.port > 65535) {
        throw new Error('PORT must be between 1 and 65535');
    }
}
