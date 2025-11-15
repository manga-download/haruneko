import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yaml';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { config } from '../config/settings.js';
import { logger, morganStream } from '../config/logger.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import sourcesRouter from './routes/sources.js';
import downloadsRouter from './routes/downloads.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Create and configure Express app
 */
export function createApp(): Express {
    const app = express();

    // Security middleware - disable CSP for Swagger UI
    app.use(helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
    }));
    app.use(cors(config.cors));

    // Rate limiting
    const limiter = rateLimit({
        windowMs: config.rateLimit.windowMs,
        max: config.rateLimit.max,
        message: {
            success: false,
            error: {
                code: 'RATE_LIMIT_EXCEEDED',
                message: 'Too many requests, please try again later.',
            },
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use(limiter);

    // Body parsing
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Compression
    app.use(compression());

    // Logging
    if (config.nodeEnv === 'development') {
        app.use(morgan('dev'));
    } else {
        app.use(morgan('combined', { stream: morganStream }));
    }

    // Health check
    app.get('/health', (_req, res) => {
        res.json({
            success: true,
            data: {
                status: 'healthy',
                version: config.apiVersion,
                uptime: process.uptime(),
                timestamp: new Date().toISOString(),
            },
        });
    });

    // API Documentation
    try {
        const openapiPath = path.join(__dirname, '../../openapi.yaml');
        const openapiDocument = yaml.parse(readFileSync(openapiPath, 'utf8'));
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument, {
            customSiteTitle: 'HakuNeko API Documentation',
            customCss: '.swagger-ui .topbar { display: none }',
        }));
        logger.info('📖 API Documentation available at /api-docs');
    } catch (error) {
        logger.warn('Failed to load OpenAPI documentation:', error);
    }

    // API routes
    app.use(`${config.apiPrefix}/sources`, sourcesRouter);
    app.use(`${config.apiPrefix}/downloads`, downloadsRouter);

    // 404 handler
    app.use(notFoundHandler);

    // Error handler
    app.use(errorHandler);

    return app;
}

/**
 * Start the server
 */
export async function startServer(): Promise<void> {
    const app = createApp();

    app.listen(config.port, config.host, () => {
        logger.info(`🚀 HakuNeko API Server started`);
        logger.info(`📡 Listening on http://${config.host}:${config.port}`);
        logger.info(`🌍 Environment: ${config.nodeEnv}`);
        logger.info(`📚 API Version: ${config.apiVersion}`);
        logger.info(`📁 Storage: ${config.storage.root}`);
    });
}
