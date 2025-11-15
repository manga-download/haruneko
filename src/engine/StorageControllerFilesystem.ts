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
        const stores = [
            Store.Settings,
            Store.Bookmarks,
            Store.Itemflags,
            Store.TagManager,
            Store.MediaLists,
        ];

        const dirs = [
            this.basePath,
            ...stores.map(store => path.join(this.basePath, store)),
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
        const tempDir = path.join(this.basePath, 'TemporaryData');

        // Handle Blob data differently from JSON data
        if (value instanceof Blob) {
            const filePath = path.join(tempDir, key);
            const buffer = Buffer.from(await value.arrayBuffer());
            await fs.writeFile(filePath, buffer);
            return key;
        } else {
            const filePath = this.getFilePath('TemporaryData', key);
            const data = JSON.stringify(value);
            await fs.writeFile(filePath, data, 'utf-8');
            return key;
        }
    }

    /**
     * Load temporary data
     */
    public async LoadTemporary<T>(key: string): Promise<T> {
        const tempDir = path.join(this.basePath, 'TemporaryData');
        const blobPath = path.join(tempDir, key);
        const jsonPath = this.getFilePath('TemporaryData', key);

        // Try to load as blob first (no .json extension)
        try {
            const buffer = await fs.readFile(blobPath);
            // Return as Blob - we need to determine the MIME type from the buffer
            const mimeType = this.detectMimeType(buffer);
            return new Blob([buffer], { type: mimeType }) as T;
        } catch (error) {
            // If blob file doesn't exist, try JSON file
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                const data = await fs.readFile(jsonPath, 'utf-8');
                return JSON.parse(data) as T;
            }
            throw error;
        }
    }

    /**
     * Detect MIME type from buffer contents
     */
    private detectMimeType(buffer: Buffer): string {
        // Check file signatures (magic numbers)
        if (buffer.length < 4) return 'application/octet-stream';

        // PNG
        if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
            return 'image/png';
        }
        // JPEG
        if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
            return 'image/jpeg';
        }
        // GIF
        if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
            return 'image/gif';
        }
        // WebP
        if (buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
            return 'image/webp';
        }
        // BMP
        if (buffer[0] === 0x42 && buffer[1] === 0x4D) {
            return 'image/bmp';
        }
        // AVIF
        if (buffer.slice(4, 12).toString() === 'ftypavif') {
            return 'image/avif';
        }

        return 'application/octet-stream';
    }

    /**
     * Remove temporary data
     */
    public async RemoveTemporary(...keys: string[]): Promise<void> {
        const tempDir = path.join(this.basePath, 'TemporaryData');

        await Promise.all(
            keys.map(async (key) => {
                // Try both blob path (without .json) and json path (with .json)
                const blobPath = path.join(tempDir, key);
                const jsonPath = this.getFilePath('TemporaryData', key);

                // Try to delete blob file first
                try {
                    await fs.unlink(blobPath);
                } catch (error) {
                    // If blob doesn't exist, try JSON file
                    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                        try {
                            await fs.unlink(jsonPath);
                        } catch (err) {
                            // Ignore ENOENT errors for JSON too
                            if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
                        }
                    } else {
                        throw error;
                    }
                }
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
