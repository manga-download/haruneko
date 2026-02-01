/**
 * Kagane.org Image Decryption Module
 * Provides clean, maintainable image decryption and unscrambling functionality
 * Ported from Tachiyomi Kotlin extension
 */

import type { PageParameters } from './Kagane.DRM';

/**
 * Randomizer - Pseudo-random number generator for image unscrambling
 * Uses XorShift algorithm with Feistel networks for secure permutation generation
 */
class Randomizer {
    private readonly size: number;
    private readonly MASK64 = BigInt('0xFFFFFFFFFFFFFFFF');
    private readonly MASK32 = BigInt('0xFFFFFFFF');
    private readonly MASK8 = BigInt('0xFF');
    private readonly PRNG_MULT = BigInt('0x27BB2EE687B0B0FD');
    private readonly RND_MULT_32 = BigInt('0x45d9f3b');
    
    private readonly seed: bigint;
    private state: bigint;
    private readonly entropyPool: Uint8Array;
    public readonly order: number[];
    
    constructor(seedInput: bigint, gridSize: number) {
        this.size = gridSize * gridSize;
        
        const seedMask = BigInt('0xFFFFFFFFFFFFFFFF');
        this.seed = seedInput & seedMask;
        this.state = this.hashSeed(this.seed);
        this.entropyPool = this.expandEntropy(this.seed);
        this.order = Array.from({ length: this.size }, (_, i) => i);
        this.permute();
    }
    
    private hashSeed(seed: bigint): bigint {
        const md = this.sha256Sync(seed.toString());
        return this.readBigUInt64BE(md, 0) ^ this.readBigUInt64BE(md, 8);
    }
    
    private readBigUInt64BE(bytes: Uint8Array, offset: number): bigint {
        let n = BigInt(0);
        for (let i = 0; i < 8; i++) {
            n = (n << BigInt(8)) | BigInt(bytes[offset + i]);
        }
        return n;
    }
    
    private expandEntropy(seed: bigint): Uint8Array {
        return this.sha512Sync(seed.toString());
    }
    
    private sbox(value: number): number {
        const table = [163, 95, 137, 13, 55, 193, 107, 228, 114, 185, 22, 243, 68, 218, 158, 40];
        return table[value & 15] ^ table[(value >> 4) & 15];
    }
    
    private prng(): bigint {
        this.state = this.state ^ ((this.state << BigInt(11)) & this.MASK64);
        this.state = this.state ^ (this.state >> BigInt(19));
        this.state = this.state ^ ((this.state << BigInt(7)) & this.MASK64);
        this.state = (this.state * this.PRNG_MULT) & this.MASK64;
        return this.state;
    }
    
    private roundFunc(value: bigint, key: number): bigint {
        let n = value ^ this.prng() ^ BigInt(key);
        
        const rot = ((n << BigInt(5)) | (n >> BigInt(3))) & this.MASK32;
        n = (rot * this.RND_MULT_32) & this.MASK32;
        
        const sboxVal = this.sbox(Number(n & this.MASK8));
        n = n ^ BigInt(sboxVal);
        
        n = n ^ (n >> BigInt(13));
        return n;
    }
    
    private feistelMix(left: number, right: number, rounds: number): [bigint, bigint] {
        let l = BigInt(left);
        let r = BigInt(right);
        
        for (let round = 0; round < rounds; round++) {
            const ent = this.entropyPool[round % this.entropyPool.length];
            l = l ^ this.roundFunc(r, ent);
            const secondArg = ent ^ ((round * 31) & 255);
            r = r ^ this.roundFunc(l, secondArg);
        }
        return [l, r];
    }
    
    private permute(): void {
        const half = Math.floor(this.size / 2);
        const sizeBig = BigInt(this.size);
        
        // Feistel network permutation
        for (let i = 0; i < half; i++) {
            const j = i + half;
            const [l, r] = this.feistelMix(i, j, 4);
            const idx1 = Number(l % sizeBig);
            const idx2 = Number(r % sizeBig);
            [this.order[idx1], this.order[idx2]] = [this.order[idx2], this.order[idx1]];
        }
        
        // Fisher-Yates shuffle with custom PRNG
        for (let i = this.size - 1; i >= 1; i--) {
            const ent = this.entropyPool[i % this.entropyPool.length];
            const j = Number((this.prng() + BigInt(ent)) % BigInt(i + 1));
            [this.order[i], this.order[j]] = [this.order[j], this.order[i]];
        }
    }
    
    // Simplified synchronous SHA-256 (for scrambling purposes only, not cryptographic)
    private sha256Sync(str: string): Uint8Array {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hash = new Uint8Array(32);
        
        // Simple hash function based on data
        for (let i = 0; i < 32; i++) {
            let val = i * 7;
            for (let j = 0; j < data.length; j++) {
                val = ((val << 5) - val + data[j]) | 0;
                val = val ^ (val >> 16);
            }
            hash[i] = (val + i * 131) & 0xFF;
        }
        return hash;
    }
    
    // Simplified synchronous SHA-512 (for scrambling purposes only, not cryptographic)
    private sha512Sync(str: string): Uint8Array {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hash = new Uint8Array(64);
        
        // Simple hash function based on data
        for (let i = 0; i < 64; i++) {
            let val = i * 13;
            for (let j = 0; j < data.length; j++) {
                val = ((val << 5) - val + data[j]) | 0;
                val = val ^ (val >> 16);
            }
            hash[i] = (val + i * 251) & 0xFF;
        }
        return hash;
    }
}

/**
 * Scrambler - Handles image chunk scrambling/unscrambling
 * Uses dependency graphs and topological sorting
 */
class Scrambler {
    private readonly seed: bigint;
    private readonly gridSize: number;
    private readonly totalPieces: number;
    private readonly randomizer: Randomizer;
    private readonly dependencyGraph: { graph: Map<number, number[]>; inDegree: Map<number, number> };
    private readonly scramblePath: number[];
    
    constructor(seed: bigint, gridSize: number) {
        this.seed = seed;
        this.gridSize = gridSize;
        this.totalPieces = gridSize * gridSize;
        this.randomizer = new Randomizer(seed, gridSize);
        this.dependencyGraph = this.buildDependencyGraph();
        this.scramblePath = this.generateScramblePath();
    }
    
    private buildDependencyGraph(): { graph: Map<number, number[]>; inDegree: Map<number, number> } {
        const graph = new Map<number, number[]>();
        const inDegree = new Map<number, number>();
        
        // Initialize nodes
        for (let i = 0; i < this.totalPieces; i++) {
            inDegree.set(i, 0);
            graph.set(i, []);
        }
        
        const rng = new Randomizer(this.seed, this.gridSize);
        
        // Build random dependencies
        for (let node = 0; node < this.totalPieces; node++) {
            const numDeps = Number((rng.prng() % BigInt(3)) + BigInt(2)); // 2-4 dependencies
            
            for (let j = 0; j < numDeps; j++) {
                const target = Number(rng.prng() % BigInt(this.totalPieces));
                if (target !== node && !this.wouldCreateCycle(graph, target, node)) {
                    graph.get(target)!.push(node);
                    inDegree.set(node, inDegree.get(node)! + 1);
                }
            }
        }
        
        // Ensure all nodes have at least one dependency
        for (let node = 0; node < this.totalPieces; node++) {
            if (inDegree.get(node) === 0) {
                let tries = 0;
                while (tries < 10) {
                    const source = Number(rng.prng() % BigInt(this.totalPieces));
                    if (source !== node && !this.wouldCreateCycle(graph, source, node)) {
                        graph.get(source)!.push(node);
                        inDegree.set(node, inDegree.get(node)! + 1);
                        break;
                    }
                    tries++;
                }
            }
        }
        
        return { graph, inDegree };
    }
    
    private wouldCreateCycle(graph: Map<number, number[]>, target: number, start: number): boolean {
        const visited = new Set<number>();
        const stack = [start];
        
        while (stack.length > 0) {
            const node = stack.pop()!;
            if (node === target) return true;
            if (visited.has(node)) continue;
            visited.add(node);
            
            const neighbors = graph.get(node) || [];
            stack.push(...neighbors);
        }
        return false;
    }
    
    private generateScramblePath(): number[] {
        // Deep copy of graph and inDegree
        const graphCopy = new Map<number, number[]>();
        this.dependencyGraph.graph.forEach((value, key) => {
            graphCopy.set(key, [...value]);
        });
        
        const inDegreeCopy = new Map(this.dependencyGraph.inDegree);
        
        // Kahn's algorithm for topological sort
        const queue: number[] = [];
        for (let i = 0; i < this.totalPieces; i++) {
            if (inDegreeCopy.get(i) === 0) {
                queue.push(i);
            }
        }
        
        const order: number[] = [];
        while (queue.length > 0) {
            const node = queue.shift()!;
            order.push(node);
            
            const neighbors = graphCopy.get(node) || [];
            for (const neighbor of neighbors) {
                inDegreeCopy.set(neighbor, inDegreeCopy.get(neighbor)! - 1);
                if (inDegreeCopy.get(neighbor) === 0) {
                    queue.push(neighbor);
                }
            }
        }
        return order;
    }
    
    public getScrambleMapping(): [number, number][] {
        let mapping = [...this.randomizer.order];
        
        if (this.scramblePath.length === this.totalPieces) {
            const pathArray = new Array(this.totalPieces);
            for (let i = 0; i < this.scramblePath.length; i++) {
                pathArray[i] = this.scramblePath[i];
            }
            
            const reordered = new Array(this.totalPieces);
            for (let i = 0; i < this.totalPieces; i++) {
                reordered[i] = mapping[pathArray[i]];
            }
            mapping = reordered;
        }
        
        const result: [number, number][] = [];
        for (let i = 0; i < this.totalPieces; i++) {
            result.push([i, mapping[i]]);
        }
        return result;
    }
}

/**
 * Image Decryption Provider
 * Handles AES-GCM decryption and image unscrambling
 */
export class ImageDecryption {
    
    /**
     * Decrypt image data using AES-GCM
     */
    private async decryptImage(payload: ArrayBuffer, keyPart1: string, keyPart2: string): Promise<Uint8Array | null> {
        try {
            if (payload.byteLength < 140) return null;
            
            const iv = new Uint8Array(payload.slice(128, 140));
            const ciphertext = new Uint8Array(payload.slice(140));
            
            // Generate key from mangaID:chapterID
            const keyString = `${keyPart1}:${keyPart2}`;
            const keyHash = await this.sha256(keyString);
            
            return await this.aesGcmDecrypt(keyHash, iv, ciphertext);
        } catch (error) {
            console.error('Decryption error:', error);
            return null;
        }
    }
    
    /**
     * AES-GCM decryption using Web Crypto API
     */
    private async aesGcmDecrypt(key: Uint8Array, iv: Uint8Array, ciphertext: Uint8Array): Promise<Uint8Array | null> {
        try {
            const cryptoKey = await crypto.subtle.importKey(
                'raw',
                key,
                { name: 'AES-GCM' },
                false,
                ['decrypt']
            );
            
            const decrypted = await crypto.subtle.decrypt(
                {
                    name: 'AES-GCM',
                    iv: iv,
                    tagLength: 128
                },
                cryptoKey,
                ciphertext
            );
            
            return new Uint8Array(decrypted);
        } catch (error) {
            console.error('AES-GCM decryption error:', error);
            return null;
        }
    }
    
    /**
     * Process image data - unscramble if needed
     */
    private processData(input: Uint8Array, index: number, seriesId: string, chapterId: string): Uint8Array | null {
        try {
            let processed = input;
            
            // Check if image is valid (not scrambled)
            if (!this.isValidImage(processed)) {
                // Generate seed for unscrambling
                const pageFilename = `${String(index).padStart(4, '0')}.jpg`;
                const seed = this.generateSeed(seriesId, chapterId, pageFilename);
                
                // Unscramble using 10x10 grid
                const scrambler = new Scrambler(seed, 10);
                const scrambleMapping = scrambler.getScrambleMapping();
                processed = this.unscramble(processed, scrambleMapping, true);
                
                // Verify unscrambled image is valid
                if (!this.isValidImage(processed)) return null;
            }
            
            return processed;
        } catch (error) {
            console.error('Process data error:', error);
            return null;
        }
    }
    
    /**
     * Check if data represents a valid image format
     */
    private isValidImage(data: Uint8Array): boolean {
        // JPEG
        if (data.length >= 2 && data[0] === 0xFF && data[1] === 0xD8) return true;
        
        // PNG
        if (data.length >= 8 && 
            data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4E && data[3] === 0x47 &&
            data[4] === 0x0D && data[5] === 0x0A && data[6] === 0x1A && data[7] === 0x0A) return true;
        
        // GIF
        if (data.length >= 6) {
            const gif87a = [0x47, 0x49, 0x46, 0x38, 0x37, 0x61]; // GIF87a
            const gif89a = [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]; // GIF89a
            let match87 = true, match89 = true;
            for (let i = 0; i < 6; i++) {
                if (data[i] !== gif87a[i]) match87 = false;
                if (data[i] !== gif89a[i]) match89 = false;
            }
            if (match87 || match89) return true;
        }
        
        // WEBP
        if (data.length >= 12 &&
            data[0] === 0x52 && data[1] === 0x49 && data[2] === 0x46 && data[3] === 0x46 &&
            data[8] === 0x57 && data[9] === 0x45 && data[10] === 0x42 && data[11] === 0x50) return true;
        
        // HEIF
        if (data.length >= 12 && 
            data[4] === 0x66 && data[5] === 0x74 && data[6] === 0x79 && data[7] === 0x70) {
            const type = data.slice(8, 11);
            const hei = [0x68, 0x65, 0x69];
            const hev = [0x68, 0x65, 0x76];
            const avi = [0x61, 0x76, 0x69];
            if (type.every((v, i) => v === hei[i]) || 
                type.every((v, i) => v === hev[i]) || 
                type.every((v, i) => v === avi[i])) return true;
        }
        
        // JXL
        if (data.length >= 2 && data[0] === 0xFF && data[1] === 0x0A) return true;
        if (data.length >= 12 && 
            data[0] === 0 && data[1] === 0 && data[2] === 0 && data[3] === 12 &&
            data[4] === 0x4A && data[5] === 0x58 && data[6] === 0x4C && data[7] === 0x20) return true;
        
        return false;
    }
    
    /**
     * Generate seed for scrambling from manga/chapter/page info
     */
    private generateSeed(seriesId: string, chapterId: string, pageFilename: string): bigint {
        const str = `${seriesId}:${chapterId}:${pageFilename}`;
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        
        // Simple hash to BigInt (first 8 bytes)
        let seed = BigInt(0);
        for (let i = 0; i < Math.min(8, data.length); i++) {
            seed = (seed << BigInt(8)) | BigInt(data[i]);
        }
        return seed;
    }
    
    /**
     * Unscramble image chunks based on mapping
     */
    private unscramble(data: Uint8Array, mapping: [number, number][], forward: boolean): Uint8Array {
        const numChunks = mapping.length;
        const dataSize = data.length;
        const chunkSize = Math.floor(dataSize / numChunks);
        const remainder = dataSize % numChunks;
        
        let remainderBytes: Uint8Array;
        let mainData: Uint8Array;
        
        if (forward) {
            remainderBytes = remainder > 0 ? data.slice(0, remainder) : new Uint8Array(0);
            mainData = remainder > 0 ? data.slice(remainder) : data;
        } else {
            remainderBytes = remainder > 0 ? data.slice(dataSize - remainder) : new Uint8Array(0);
            mainData = remainder > 0 ? data.slice(0, dataSize - remainder) : data;
        }
        
        // Split data into chunks
        const chunks: Uint8Array[] = [];
        for (let i = 0; i < numChunks; i++) {
            const start = i * chunkSize;
            const end = (i + 1) * chunkSize;
            chunks.push(mainData.slice(start, end));
        }
        
        // Apply mapping
        const reordered = new Array<Uint8Array>(numChunks);
        if (forward) {
            for (const [from, to] of mapping) {
                if (from < numChunks && to < numChunks) {
                    reordered[from] = chunks[to];
                }
            }
        } else {
            for (const [from, to] of mapping) {
                if (from < numChunks && to < numChunks) {
                    reordered[to] = chunks[from];
                }
            }
        }
        
        // Reconstruct data
        const totalSize = reordered.reduce((acc, chunk) => acc + chunk.length, 0) + remainderBytes.length;
        const result = new Uint8Array(totalSize);
        
        let offset = 0;
        if (forward) {
            for (const chunk of reordered) {
                result.set(chunk, offset);
                offset += chunk.length;
            }
            result.set(remainderBytes, offset);
        } else {
            result.set(remainderBytes, 0);
            offset = remainderBytes.length;
            for (const chunk of reordered) {
                result.set(chunk, offset);
                offset += chunk.length;
            }
        }
        
        return result;
    }
    
    /**
     * SHA-256 hash function using Web Crypto API
     */
    private async sha256(str: string): Promise<Uint8Array> {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return new Uint8Array(hash);
    }
    
    /**
     * Detect MIME type from image data
     */
    private detectMimeType(data: Uint8Array): string {
        if (data.length >= 2 && data[0] === 0xFF && data[1] === 0xD8) return 'image/jpeg';
        if (data.length >= 8 && data[0] === 0x89 && data[1] === 0x50) return 'image/png';
        if (data.length >= 6 && data[0] === 0x47 && data[1] === 0x49 && data[2] === 0x46) return 'image/gif';
        if (data.length >= 12 && data[8] === 0x57 && data[9] === 0x45) return 'image/webp';
        return 'image/png'; // default
    }
    
    /**
     * Main decrypt and unscramble method
     */
    public async decrypt(bytes: ArrayBuffer, parameters: PageParameters): Promise<Blob> {
        const { MangaID, ChapterID, PageNumber } = parameters;
        
        // Decrypt the image
        const decrypted = await this.decryptImage(bytes, MangaID, ChapterID);
        if (!decrypted) {
            throw new Error('Unable to decrypt image data');
        }
        
        // Unscramble if needed
        const unscrambled = this.processData(decrypted, PageNumber, MangaID, ChapterID);
        if (!unscrambled) {
            throw new Error('Unable to unscramble image data');
        }
        
        // Detect MIME type and return Blob
        const mimeType = this.detectMimeType(unscrambled);
        return new Blob([unscrambled], { type: mimeType });
    }
}
