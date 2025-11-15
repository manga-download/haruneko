import { promises as fs } from 'fs';
import path from 'path';
import { type StorageController, Store } from './StorageController.js';
import { config } from '../config/settings.js';

/**
 * A storage controller that uses the filesystem for persistence.
 * It is intended to be used within Node.js server environments.
 */
export class StorageControllerFilesystem implements StorageController {
    private readonly basePath: string;

    constructor(basePath?: string) {
        this.basePath = basePath || config.storage.database;
        this.ensureDirectories();
    }

    /**
     * Ensure all required directories exist
     */
    private async ensureDirectories(): Promise<void> {
        const dirs = [
            this.basePath,
            ...Object.values(Store).map(store => path.join(this.basePath, store)),
            path.join(this.basePath, 'TemporaryData'),
        ];

        for (const dir of dirs) {
            await fs.mkdir(dir, { recursive: true });
        }
    }

    /**
     * Get the file path for a store and optional key
     */
    private getFilePath(store: Store | 'TemporaryData', key?: string): string {
        const storeDir = path.join(this.basePath, store);
        if (key) {
            // Sanitize key to be filesystem-safe
            const safeKey = key.replace(/[^a-zA-Z0-9-_]/g, '_');
            return path.join(storeDir, `${safeKey}.json`);
        }
        return path.join(storeDir, 'data.json');
    }

    /**
     * Save persistent data
     */
    public async SavePersistent<T>(value: T, store: Store, key?: string): Promise<void> {
        const filePath = this.getFilePath(store, key);
        const data = JSON.stringify(value, null, 2);
        await fs.writeFile(filePath, data, 'utf-8');
    }

    /**
     * Load persistent data
     */
    public async LoadPersistent<T>(store: Store, key?: string): Promise<T | undefined> {
        try {
            const filePath = this.getFilePath(store, key);
            const data = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(data) as T;
        } catch (error) {
            // Return undefined if file doesn't exist
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                return undefined;
            }
            throw error;
        }
    }

    /**
     * Remove persistent data
     */
    public async RemovePersistent(store: Store, ...keys: string[]): Promise<void> {
        if (keys.length === 0) {
            // Clear entire store
            const storeDir = path.join(this.basePath, store);
            const files = await fs.readdir(storeDir);
            await Promise.all(files.map(file => fs.unlink(path.join(storeDir, file))));
        } else {
            // Remove specific keys
            await Promise.all(
                keys.map(key => {
                    const filePath = this.getFilePath(store, key);
                    return fs.unlink(filePath).catch(err => {
                        // Ignore ENOENT errors
                        if (err.code !== 'ENOENT') throw err;
                    });
                })
            );
        }
    }

    /**
     * Save temporary data
     */
    public async SaveTemporary<T>(value: T): Promise<string> {
        const key = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const filePath = this.getFilePath('TemporaryData', key);
        const data = JSON.stringify(value);
        await fs.writeFile(filePath, data, 'utf-8');
        return key;
    }

    /**
     * Load temporary data
     */
    public async LoadTemporary<T>(key: string): Promise<T> {
        const filePath = this.getFilePath('TemporaryData', key);
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data) as T;
    }

    /**
     * Remove temporary data
     */
    public async RemoveTemporary(...keys: string[]): Promise<void> {
        await Promise.all(
            keys.map(key => {
                const filePath = this.getFilePath('TemporaryData', key);
                return fs.unlink(filePath).catch(err => {
                    // Ignore ENOENT errors
                    if (err.code !== 'ENOENT') throw err;
                });
            })
        );
    }

    /**
     * Clean up old temporary files
     */
    public async CleanupTemporary(maxAgeMs: number = 24 * 60 * 60 * 1000): Promise<void> {
        const tempDir = path.join(this.basePath, 'TemporaryData');
        const files = await fs.readdir(tempDir);
        const now = Date.now();

        await Promise.all(
            files.map(async (file) => {
                const filePath = path.join(tempDir, file);
                const stats = await fs.stat(filePath);
                if (now - stats.mtimeMs > maxAgeMs) {
                    await fs.unlink(filePath).catch(() => {
                        /* ignore errors */
                    });
                }
            })
        );
    }
}
