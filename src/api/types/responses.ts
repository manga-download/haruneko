/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: ApiError;
    meta?: ResponseMeta;
}

/**
 * API error structure
 */
export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    stack?: string;
}

/**
 * Pagination and metadata
 */
export interface ResponseMeta {
    page?: number;
    totalPages?: number;
    total?: number;
    limit?: number;
    timestamp?: string;
}

/**
 * Download request payload
 */
export interface DownloadRequest {
    sourceId: string;
    mangaId: string;
    chapterIds: string[];
    format?: 'cbz' | 'pdf' | 'epub' | 'images';
    options?: {
        quality?: 'low' | 'medium' | 'high';
        includeMetadata?: boolean;
    };
}

/**
 * Download status response
 */
export interface DownloadStatus {
    id: string;
    sourceId: string;
    mangaId: string;
    chapterIds: string[];
    status: 'queued' | 'downloading' | 'processing' | 'completed' | 'failed' | 'cancelled';
    progress: number;
    totalBytes?: number;
    downloadedBytes?: number;
    currentChapter?: string;
    format: string;
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
    error?: string;
    fileUrl?: string;
}

/**
 * Manga source info
 */
export interface SourceInfo {
    id: string;
    title: string;
    url: string;
    icon?: string;
    tags: string[];
    supportsSearch: boolean;
    supportsList: boolean;
    language?: string;
    status: 'active' | 'inactive' | 'broken';
}

/**
 * Manga info
 */
export interface MangaInfo {
    id: string;
    title: string;
    sourceId: string;
    url?: string;
    coverUrl?: string;
    description?: string;
    authors?: string[];
    artists?: string[];
    genres?: string[];
    tags?: string[];
    status?: string;
    year?: number;
}

/**
 * Chapter info
 */
export interface ChapterInfo {
    id: string;
    title: string;
    mangaId: string;
    sourceId: string;
    number?: number;
    volume?: number;
    language?: string;
    releaseDate?: string;
    pageCount?: number;
}

/**
 * Search query parameters
 */
export interface SearchQuery {
    q?: string;
    page?: number;
    limit?: number;
    sort?: 'title' | 'updated' | 'popular';
    order?: 'asc' | 'desc';
}
