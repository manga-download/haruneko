/**
 * Kagane.org DRM Decryption Implementation
 * Ported from Tachiyomi Kotlin extension
 */

/**
 * Randomizer - PRNG for image unscrambling
 */
class Randomizer {
    constructor(seedInput, t) {
        this.size = t * t;
        
        // Constants
        this.MASK64 = BigInt('0xFFFFFFFFFFFFFFFF');
        this.MASK32 = BigInt('0xFFFFFFFF');
        this.MASK8 = BigInt('0xFF');
        this.PRNG_MULT = BigInt('0x27BB2EE687B0B0FD');
        this.RND_MULT_32 = BigInt('0x45d9f3b');
        
        // Initialize
        const seedMask = BigInt('0xFFFFFFFFFFFFFFFF');
        this.seed = seedInput & seedMask;
        this.state = this.hashSeed(this.seed);
        this.entropyPool = this.expandEntropy(this.seed);
        this.order = Array.from({ length: this.size }, (_, i) => i);
        this.permute();
    }
    
    hashSeed(e) {
        const md = this.sha256Sync(e.toString());
        return this.readBigUInt64BE(md, 0) ^ this.readBigUInt64BE(md, 8);
    }
    
    readBigUInt64BE(bytes, offset) {
        let n = BigInt(0);
        for (let i = 0; i < 8; i++) {
            n = (n << BigInt(8)) | BigInt(bytes[offset + i]);
        }
        return n;
    }
    
    expandEntropy(e) {
        return this.sha512Sync(e.toString());
    }
    
    sbox(e) {
        const t = [163, 95, 137, 13, 55, 193, 107, 228, 114, 185, 22, 243, 68, 218, 158, 40];
        return t[e & 15] ^ t[(e >> 4) & 15];
    }
    
    prng() {
        this.state = this.state ^ ((this.state << BigInt(11)) & this.MASK64);
        this.state = this.state ^ (this.state >> BigInt(19));
        this.state = this.state ^ ((this.state << BigInt(7)) & this.MASK64);
        this.state = (this.state * this.PRNG_MULT) & this.MASK64;
        return this.state;
    }
    
    roundFunc(e, t) {
        let n = e ^ this.prng() ^ BigInt(t);
        
        const rot = ((n << BigInt(5)) | (n >> BigInt(3))) & this.MASK32;
        n = (rot * this.RND_MULT_32) & this.MASK32;
        
        const sboxVal = this.sbox(Number(n & this.MASK8));
        n = n ^ BigInt(sboxVal);
        
        n = n ^ (n >> BigInt(13));
        return n;
    }
    
    feistelMix(e, t, rounds) {
        let r = BigInt(e);
        let i = BigInt(t);
        for (let round = 0; round < rounds; round++) {
            const ent = this.entropyPool[round % this.entropyPool.length];
            r = r ^ this.roundFunc(i, ent);
            const secondArg = ent ^ ((round * 31) & 255);
            i = i ^ this.roundFunc(r, secondArg);
        }
        return [r, i];
    }
    
    permute() {
        const half = Math.floor(this.size / 2);
        const sizeBig = BigInt(this.size);
        
        for (let t = 0; t < half; t++) {
            const n = t + half;
            const [rBig, iBig] = this.feistelMix(t, n, 4);
            const s = Number(rBig % sizeBig);
            const a = Number(iBig % sizeBig);
            const tmp = this.order[s];
            this.order[s] = this.order[a];
            this.order[a] = tmp;
        }
        
        for (let e = this.size - 1; e >= 1; e--) {
            const ent = this.entropyPool[e % this.entropyPool.length];
            const idxBig = (this.prng() + BigInt(ent)) % BigInt(e + 1);
            const n = Number(idxBig);
            const tmp = this.order[e];
            this.order[e] = this.order[n];
            this.order[n] = tmp;
        }
    }
    
    // Synchronous SHA-256 implementation for compatibility
    sha256Sync(str) {
        const bytes = new TextEncoder().encode(str);
        // Simple synchronous SHA-256 using crypto-js style implementation
        // For actual implementation, we'll use a minimal sha256
        return this.simpleSHA256(bytes);
    }
    
    // Synchronous SHA-512 implementation
    sha512Sync(str) {
        const bytes = new TextEncoder().encode(str);
        return this.simpleSHA512(bytes);
    }
    
    // Minimal SHA-256 implementation
    simpleSHA256(message) {
        const K = [
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
        ];
        
        let H = [
            0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
            0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
        ];
        
        const padded = this.pad(message);
        
        for (let chunk = 0; chunk < padded.length; chunk += 64) {
            const W = new Array(64);
            
            for (let i = 0; i < 16; i++) {
                W[i] = (padded[chunk + i * 4] << 24) | (padded[chunk + i * 4 + 1] << 16) |
                       (padded[chunk + i * 4 + 2] << 8) | padded[chunk + i * 4 + 3];
            }
            
            for (let i = 16; i < 64; i++) {
                const s0 = this.rotr(W[i - 15], 7) ^ this.rotr(W[i - 15], 18) ^ (W[i - 15] >>> 3);
                const s1 = this.rotr(W[i - 2], 17) ^ this.rotr(W[i - 2], 19) ^ (W[i - 2] >>> 10);
                W[i] = (W[i - 16] + s0 + W[i - 7] + s1) >>> 0;
            }
            
            let [a, b, c, d, e, f, g, h] = H;
            
            for (let i = 0; i < 64; i++) {
                const S1 = this.rotr(e, 6) ^ this.rotr(e, 11) ^ this.rotr(e, 25);
                const ch = (e & f) ^ (~e & g);
                const temp1 = (h + S1 + ch + K[i] + W[i]) >>> 0;
                const S0 = this.rotr(a, 2) ^ this.rotr(a, 13) ^ this.rotr(a, 22);
                const maj = (a & b) ^ (a & c) ^ (b & c);
                const temp2 = (S0 + maj) >>> 0;
                
                h = g;
                g = f;
                f = e;
                e = (d + temp1) >>> 0;
                d = c;
                c = b;
                b = a;
                a = (temp1 + temp2) >>> 0;
            }
            
            H[0] = (H[0] + a) >>> 0;
            H[1] = (H[1] + b) >>> 0;
            H[2] = (H[2] + c) >>> 0;
            H[3] = (H[3] + d) >>> 0;
            H[4] = (H[4] + e) >>> 0;
            H[5] = (H[5] + f) >>> 0;
            H[6] = (H[6] + g) >>> 0;
            H[7] = (H[7] + h) >>> 0;
        }
        
        const result = new Uint8Array(32);
        for (let i = 0; i < 8; i++) {
            result[i * 4] = (H[i] >>> 24) & 0xff;
            result[i * 4 + 1] = (H[i] >>> 16) & 0xff;
            result[i * 4 + 2] = (H[i] >>> 8) & 0xff;
            result[i * 4 + 3] = H[i] & 0xff;
        }
        return result;
    }
    
    // Minimal SHA-512 implementation
    simpleSHA512(message) {
        const K = [
            0x428a2f98d728ae22n, 0x7137449123ef65cdn, 0xb5c0fbcfec4d3b2fn, 0xe9b5dba58189dbbcn,
            0x3956c25bf348b538n, 0x59f111f1b605d019n, 0x923f82a4af194f9bn, 0xab1c5ed5da6d8118n,
            0xd807aa98a3030242n, 0x12835b0145706fben, 0x243185be4ee4b28cn, 0x550c7dc3d5ffb4e2n,
            0x72be5d74f27b896fn, 0x80deb1fe3b1696b1n, 0x9bdc06a725c71235n, 0xc19bf174cf692694n,
            0xe49b69c19ef14ad2n, 0xefbe4786384f25e3n, 0x0fc19dc68b8cd5b5n, 0x240ca1cc77ac9c65n,
            0x2de92c6f592b0275n, 0x4a7484aa6ea6e483n, 0x5cb0a9dcbd41fbd4n, 0x76f988da831153b5n,
            0x983e5152ee66dfabn, 0xa831c66d2db43210n, 0xb00327c898fb213fn, 0xbf597fc7beef0ee4n,
            0xc6e00bf33da88fc2n, 0xd5a79147930aa725n, 0x06ca6351e003826fn, 0x142929670a0e6e70n,
            0x27b70a8546d22ffcn, 0x2e1b21385c26c926n, 0x4d2c6dfc5ac42aedn, 0x53380d139d95b3dfn,
            0x650a73548baf63den, 0x766a0abb3c77b2a8n, 0x81c2c92e47edaee6n, 0x92722c851482353bn,
            0xa2bfe8a14cf10364n, 0xa81a664bbc423001n, 0xc24b8b70d0f89791n, 0xc76c51a30654be30n,
            0xd192e819d6ef5218n, 0xd69906245565a910n, 0xf40e35855771202an, 0x106aa07032bbd1b8n,
            0x19a4c116b8d2d0c8n, 0x1e376c085141ab53n, 0x2748774cdf8eeb99n, 0x34b0bcb5e19b48a8n,
            0x391c0cb3c5c95a63n, 0x4ed8aa4ae3418acbn, 0x5b9cca4f7763e373n, 0x682e6ff3d6b2b8a3n,
            0x748f82ee5defb2fcn, 0x78a5636f43172f60n, 0x84c87814a1f0ab72n, 0x8cc702081a6439ecn,
            0x90befffa23631e28n, 0xa4506cebde82bde9n, 0xbef9a3f7b2c67915n, 0xc67178f2e372532bn,
            0xca273eceea26619cn, 0xd186b8c721c0c207n, 0xeada7dd6cde0eb1en, 0xf57d4f7fee6ed178n,
            0x06f067aa72176fban, 0x0a637dc5a2c898a6n, 0x113f9804bef90daen, 0x1b710b35131c471bn,
            0x28db77f523047d84n, 0x32caab7b40c72493n, 0x3c9ebe0a15c9bebcn, 0x431d67c49c100d4cn,
            0x4cc5d4becb3e42b6n, 0x597f299cfc657e2an, 0x5fcb6fab3ad6faecn, 0x6c44198c4a475817n
        ];
        
        let H = [
            0x6a09e667f3bcc908n, 0xbb67ae8584caa73bn, 0x3c6ef372fe94f82bn, 0xa54ff53a5f1d36f1n,
            0x510e527fade682d1n, 0x9b05688c2b3e6c1fn, 0x1f83d9abfb41bd6bn, 0x5be0cd19137e2179n
        ];
        
        const padded = this.pad512(message);
        
        for (let chunk = 0; chunk < padded.length; chunk += 128) {
            const W = new Array(80);
            
            for (let i = 0; i < 16; i++) {
                W[i] = BigInt(0);
                for (let j = 0; j < 8; j++) {
                    W[i] = (W[i] << 8n) | BigInt(padded[chunk + i * 8 + j]);
                }
            }
            
            for (let i = 16; i < 80; i++) {
                const s0 = this.rotr64(W[i - 15], 1n) ^ this.rotr64(W[i - 15], 8n) ^ (W[i - 15] >> 7n);
                const s1 = this.rotr64(W[i - 2], 19n) ^ this.rotr64(W[i - 2], 61n) ^ (W[i - 2] >> 6n);
                W[i] = (W[i - 16] + s0 + W[i - 7] + s1) & 0xFFFFFFFFFFFFFFFFn;
            }
            
            let [a, b, c, d, e, f, g, h] = H;
            
            for (let i = 0; i < 80; i++) {
                const S1 = this.rotr64(e, 14n) ^ this.rotr64(e, 18n) ^ this.rotr64(e, 41n);
                const ch = (e & f) ^ (~e & g);
                const temp1 = (h + S1 + ch + K[i] + W[i]) & 0xFFFFFFFFFFFFFFFFn;
                const S0 = this.rotr64(a, 28n) ^ this.rotr64(a, 34n) ^ this.rotr64(a, 39n);
                const maj = (a & b) ^ (a & c) ^ (b & c);
                const temp2 = (S0 + maj) & 0xFFFFFFFFFFFFFFFFn;
                
                h = g;
                g = f;
                f = e;
                e = (d + temp1) & 0xFFFFFFFFFFFFFFFFn;
                d = c;
                c = b;
                b = a;
                a = (temp1 + temp2) & 0xFFFFFFFFFFFFFFFFn;
            }
            
            H[0] = (H[0] + a) & 0xFFFFFFFFFFFFFFFFn;
            H[1] = (H[1] + b) & 0xFFFFFFFFFFFFFFFFn;
            H[2] = (H[2] + c) & 0xFFFFFFFFFFFFFFFFn;
            H[3] = (H[3] + d) & 0xFFFFFFFFFFFFFFFFn;
            H[4] = (H[4] + e) & 0xFFFFFFFFFFFFFFFFn;
            H[5] = (H[5] + f) & 0xFFFFFFFFFFFFFFFFn;
            H[6] = (H[6] + g) & 0xFFFFFFFFFFFFFFFFn;
            H[7] = (H[7] + h) & 0xFFFFFFFFFFFFFFFFn;
        }
        
        const result = new Uint8Array(64);
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                result[i * 8 + j] = Number((H[i] >> BigInt((7 - j) * 8)) & 0xFFn);
            }
        }
        return result;
    }
    
    rotr(n, b) {
        return ((n >>> b) | (n << (32 - b))) >>> 0;
    }
    
    rotr64(n, b) {
        return ((n >> b) | (n << (64n - b))) & 0xFFFFFFFFFFFFFFFFn;
    }
    
    pad(message) {
        const ml = message.length * 8;
        const padLen = (56 - (message.length + 1) % 64 + 64) % 64;
        const padded = new Uint8Array(message.length + 1 + padLen + 8);
        padded.set(message);
        padded[message.length] = 0x80;
        for (let i = 0; i < 8; i++) {
            padded[padded.length - 1 - i] = (ml >>> (i * 8)) & 0xff;
        }
        return padded;
    }
    
    pad512(message) {
        const ml = BigInt(message.length * 8);
        const padLen = (112 - (message.length + 1) % 128 + 128) % 128;
        const padded = new Uint8Array(message.length + 1 + padLen + 16);
        padded.set(message);
        padded[message.length] = 0x80;
        for (let i = 0; i < 16; i++) {
            padded[padded.length - 1 - i] = Number((ml >> BigInt(i * 8)) & 0xFFn);
        }
        return padded;
    }
}

/**
 * Scrambler - Image scrambling/unscrambling logic
 */
class Scrambler {
    constructor(seed, gridSize) {
        this.seed = seed;
        this.gridSize = gridSize;
        this.totalPieces = gridSize * gridSize;
        this.randomizer = new Randomizer(seed, gridSize);
        this.dependencyGraph = this.buildDependencyGraph();
        this.scramblePath = this.generateScramblePath();
    }
    
    buildDependencyGraph() {
        const graph = new Map();
        const inDegree = new Map();
        
        for (let n = 0; n < this.totalPieces; n++) {
            inDegree.set(n, 0);
            graph.set(n, []);
        }
        
        const rng = new Randomizer(this.seed, this.gridSize);
        
        for (let r = 0; r < this.totalPieces; r++) {
            const i = Number((rng.prng() % BigInt(3)) + BigInt(2));
            for (let k = 0; k < i; k++) {
                const j = Number(rng.prng() % BigInt(this.totalPieces));
                if (j !== r && !this.wouldCreateCycle(graph, j, r)) {
                    graph.get(j).push(r);
                    inDegree.set(r, inDegree.get(r) + 1);
                }
            }
        }
        
        for (let r = 0; r < this.totalPieces; r++) {
            if (inDegree.get(r) === 0) {
                let tries = 0;
                while (tries < 10) {
                    const s = Number(rng.prng() % BigInt(this.totalPieces));
                    if (s !== r && !this.wouldCreateCycle(graph, s, r)) {
                        graph.get(s).push(r);
                        inDegree.set(r, inDegree.get(r) + 1);
                        break;
                    }
                    tries++;
                }
            }
        }
        
        return { graph, inDegree };
    }
    
    wouldCreateCycle(graph, target, start) {
        const visited = new Set();
        const stack = [start];
        
        while (stack.length > 0) {
            const n = stack.pop();
            if (n === target) return true;
            if (visited.has(n)) continue;
            visited.add(n);
            const neighbors = graph.get(n);
            if (neighbors) {
                stack.push(...neighbors);
            }
        }
        return false;
    }
    
    generateScramblePath() {
        const graphCopy = new Map();
        const inDegreeCopy = new Map();
        
        for (const [key, value] of this.dependencyGraph.graph) {
            graphCopy.set(key, [...value]);
        }
        for (const [key, value] of this.dependencyGraph.inDegree) {
            inDegreeCopy.set(key, value);
        }
        
        const queue = [];
        for (let n = 0; n < this.totalPieces; n++) {
            if (inDegreeCopy.get(n) === 0) {
                queue.push(n);
            }
        }
        
        const order = [];
        while (queue.length > 0) {
            const i = queue.shift();
            order.push(i);
            const neighbors = graphCopy.get(i);
            if (neighbors) {
                for (const e of neighbors) {
                    inDegreeCopy.set(e, inDegreeCopy.get(e) - 1);
                    if (inDegreeCopy.get(e) === 0) {
                        queue.push(e);
                    }
                }
            }
        }
        return order;
    }
    
    getScrambleMapping() {
        let e = [...this.randomizer.order];
        
        if (this.scramblePath.length === this.totalPieces) {
            const t = new Array(this.totalPieces);
            for (let i = 0; i < this.scramblePath.length; i++) {
                t[i] = this.scramblePath[i];
            }
            const n = new Array(this.totalPieces);
            for (let r = 0; r < this.totalPieces; r++) {
                n[r] = e[t[r]];
            }
            e = n;
        }
        
        const result = [];
        for (let n = 0; n < this.totalPieces; n++) {
            result.push([n, e[n]]);
        }
        return result;
    }
}

/**
 * Main DRM Provider Class
 */
export class DRMProvider {
    
    /**
     * Create image links with parameters for downloading
     * @param {URL} chapterURL - URL to request image links from
     * @param {string} mangaIdentifier - Manga ID
     * @param {string} chapterIdentifier - Chapter ID
     * @returns {Promise<Array>} - Array of page objects with link and parameters
     */
    async CreateImageLinks(chapterURL, mangaIdentifier, chapterIdentifier) {
        const initData = await this.createChallengeInitData(mangaIdentifier, chapterIdentifier);
        const challenge = await this.createMediaLicenseChallenge(initData);
        const challengeBase64 = this.getBase64FromBytes(challenge);
        
        const response = await fetch(chapterURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ challenge: challengeBase64 })
        });
        
        const { cache_url, access_token, page_mapping } = await response.json();
        
        return Object.keys(page_mapping).map((pageNum, index) => {
            const parameters = {
                MangaID: mangaIdentifier,
                ChapterID: chapterIdentifier,
                PageNumber: index + 1
            };
            const filename = page_mapping[parameters.PageNumber];
            const url = new URL([cache_url, 'media', 'v1', 'books', mangaIdentifier, 'chapters', chapterIdentifier, filename].join('/'));
            url.searchParams.set('token', access_token);
            
            return {
                link: url,
                parameters: parameters
            };
        });
    }
    
    /**
     * Decrypt and unscramble image data
     * @param {ArrayBuffer} bytes - Encrypted image data
     * @param {Object} parameters - Contains MangaID, ChapterID, PageNumber
     * @returns {Promise<Blob>} - Decrypted image blob
     */
    async DecryptImage(bytes, parameters) {
        const { MangaID, ChapterID, PageNumber } = parameters;
        const data = new Uint8Array(bytes);
        
        // Step 1: Decrypt the image
        const decrypted = await this.decryptImage(data, MangaID, ChapterID);
        if (!decrypted) {
            throw new Error('Unable to decrypt data');
        }
        
        // Step 2: Unscramble if needed
        const unscrambled = this.processData(decrypted, PageNumber, MangaID, ChapterID);
        if (!unscrambled) {
            throw new Error('Unable to unscramble data');
        }
        
        // Determine MIME type from image signature
        const mimeType = this.getImageMimeType(unscrambled) || 'application/octet-stream';
        
        // Return as Blob with correct MIME type
        return new Blob([unscrambled], { type: mimeType });
    }
    
    /**
     * Create challenge init data
     */
    async createChallengeInitData(mangaId, chapterId) {
        const hash = await this.sha256(`${mangaId}:${chapterId}`);
        return new Uint8Array([
            0, 0, 0, 12, 74, 88, 76, 32, 13, 10, 135, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            ...hash.slice(0, 32)
        ]);
    }
    
    /**
     * Create media license challenge (stub for compatibility)
     */
    async createMediaLicenseChallenge(initData) {
        return initData;
    }
    
    /**
     * Convert bytes to Base64
     */
    getBase64FromBytes(bytes) {
        let binary = '';
        const len = bytes.length;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }
    
    /**
     * Decrypt image data using AES-GCM
     */
    async decryptImage(payload, keyPart1, keyPart2) {
        try {
            if (payload.length < 140) return null;
            
            // Extract IV and ciphertext
            const iv = payload.slice(128, 140);
            const ciphertext = payload.slice(140);
            
            // Generate key from SHA-256 hash of "seriesId:chapterId"
            const keyString = `${keyPart1}:${keyPart2}`;
            const keyHash = await this.sha256(keyString);
            
            // Import key for AES-GCM
            const key = await crypto.subtle.importKey(
                'raw',
                keyHash,
                { name: 'AES-GCM' },
                false,
                ['decrypt']
            );
            
            // Decrypt using AES-GCM
            const decrypted = await crypto.subtle.decrypt(
                {
                    name: 'AES-GCM',
                    iv: iv,
                    tagLength: 128
                },
                key,
                ciphertext
            );
            
            return new Uint8Array(decrypted);
        } catch (error) {
            console.error('Decryption error:', error);
            return null;
        }
    }
    
    /**
     * Process (unscramble) the decrypted image data
     */
    processData(input, index, seriesId, chapterId) {
        try {
            let processed = input;
            
            // Check if data is a valid image
            if (!this.isValidImage(processed)) {
                // Generate seed for unscrambling
                const seed = this.generateSeed(seriesId, chapterId, this.formatIndex(index));
                const scrambler = new Scrambler(seed, 10);
                const scrambleMapping = scrambler.getScrambleMapping();
                
                // Unscramble the data
                processed = this.unscramble(processed, scrambleMapping, true);
                
                // Check again if it's valid
                if (!this.isValidImage(processed)) {
                    return null;
                }
            }
            
            return processed;
        } catch (error) {
            console.error('Process data error:', error);
            return null;
        }
    }
    
    /**
     * Check if data is a valid image format
     * @returns {string|null} MIME type if valid, null otherwise
     */
    getImageMimeType(data) {
        if (data.length < 2) return null;
        
        // JPEG
        if (data[0] === 0xFF && data[1] === 0xD8) return 'image/jpeg';
        
        // PNG
        if (data.length >= 8) {
            if (data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4E && data[3] === 0x47 &&
                data[4] === 0x0D && data[5] === 0x0A && data[6] === 0x1A && data[7] === 0x0A) {
                return 'image/png';
            }
        }
        
        // GIF
        if (data.length >= 6) {
            const header = String.fromCharCode(...data.slice(0, 6));
            if (header === 'GIF87a' || header === 'GIF89a') return 'image/gif';
        }
        
        // WEBP
        if (data.length >= 12) {
            if (data[0] === 0x52 && data[1] === 0x49 && data[2] === 0x46 && data[3] === 0x46 &&
                data[8] === 0x57 && data[9] === 0x45 && data[10] === 0x42 && data[11] === 0x50) {
                return 'image/webp';
            }
        }
        
        // HEIF
        if (data.length >= 12) {
            const ftyp = String.fromCharCode(...data.slice(4, 8));
            if (ftyp === 'ftyp') {
                const type = String.fromCharCode(...data.slice(8, 11));
                if (type === 'hei' || type === 'hev' || type === 'avi') return 'image/heif';
            }
        }
        
        // JXL
        if (data[0] === 0xFF && data[1] === 0x0A) return 'image/jxl';
        if (data.length >= 12) {
            if (data[0] === 0 && data[1] === 0 && data[2] === 0 && data[3] === 12 &&
                data[4] === 0x4A && data[5] === 0x58 && data[6] === 0x4C && data[7] === 0x20) {
                return 'image/jxl';
            }
        }
        
        return null;
    }
    
    /**
     * Check if data is a valid image format (legacy compatibility)
     */
    isValidImage(data) {
        return this.getImageMimeType(data) !== null;
    }
    
    /**
     * Generate seed for scrambling
     */
    generateSeed(t, n, e) {
        const sha256 = new Randomizer(BigInt(0), 1).sha256Sync(`${t}:${n}:${e}`);
        let a = BigInt(0);
        for (let i = 0; i < 8; i++) {
            a = (a << BigInt(8)) | BigInt(sha256[i]);
        }
        return a;
    }
    
    /**
     * Format page index as filename (e.g., 0 -> "0001.jpg")
     * Note: The extension .jpg is used as a default since the scrambling
     * algorithm from the Kotlin implementation uses this format
     */
    formatIndex(index) {
        return String(index + 1).padStart(4, '0') + '.jpg';
    }
    
    /**
     * Unscramble image data using mapping
     */
    unscramble(data, mapping, n) {
        const s = mapping.length;
        const a = data.length;
        const l = Math.floor(a / s);
        const o = a % s;
        
        let r, i;
        if (n) {
            if (o > 0) {
                r = data.slice(0, o);
                i = data.slice(o, a);
            } else {
                r = new Uint8Array(0);
                i = data;
            }
        } else {
            if (o > 0) {
                r = data.slice(a - o, a);
                i = data.slice(0, a - o);
            } else {
                r = new Uint8Array(0);
                i = data;
            }
        }
        
        // Split into chunks
        const chunks = [];
        for (let idx = 0; idx < s; idx++) {
            const start = idx * l;
            const end = (idx + 1) * l;
            chunks.push(i.slice(start, end));
        }
        
        // Apply mapping
        const u = new Array(s);
        if (n) {
            for (const [e, m] of mapping) {
                if (e < s && m < s) {
                    u[e] = chunks[m];
                }
            }
        } else {
            for (const [e, m] of mapping) {
                if (e < s && m < s) {
                    u[m] = chunks[e];
                }
            }
        }
        
        // Combine chunks
        const totalLen = u.reduce((acc, chunk) => acc + chunk.length, 0);
        const h = new Uint8Array(totalLen);
        let offset = 0;
        for (const chunk of u) {
            h.set(chunk, offset);
            offset += chunk.length;
        }
        
        // Append remainder
        if (n) {
            const result = new Uint8Array(h.length + r.length);
            result.set(h, 0);
            result.set(r, h.length);
            return result;
        } else {
            const result = new Uint8Array(r.length + h.length);
            result.set(r, 0);
            result.set(h, r.length);
            return result;
        }
    }
    
    /**
     * SHA-256 helper using Web Crypto API
     */
    async sha256(str) {
        const bytes = new TextEncoder().encode(str);
        const hash = await crypto.subtle.digest('SHA-256', bytes);
        return new Uint8Array(hash);
    }
}
