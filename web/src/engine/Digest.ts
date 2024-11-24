export function DJB2(text: string, seed = 5381): number {
    let hash = seed;
    for (let index = text.length - 1; index > -1; index--) {
        hash = (hash << 5) + hash ^ text.charCodeAt(index);
    }
    return hash >>> 0;
}

export function SDBM(text: string, seed = 0): number {
    let hash = seed;
    for (let index = text.length - 1; index > -1; index--) {
        hash = (hash << 16) + (hash << 6) - hash + text.charCodeAt(index);
    }
    return hash >>> 0;
}

export function FNV1A(text: string, seed = 2166136261): number {
    let hash = seed;
    for (let index = 0; index < text.length; index++) {
        hash = hash ^ text.charCodeAt(index);
        hash = (hash << 24) + (hash << 8) + (hash << 7) + (hash << 4) + (hash << 1) + hash;
    }
    return hash >>> 0;
}

/**
 * Customized 64-Bit checksum calculation based on two concatenated DJB2 algorithms to reduce the probability of hash collisions.
 */
export function DJB64(text: string, seed = 5381): string {
    let high = seed;
    let low = ~seed;
    for (let index = 0; index < text.length; index++) {
        high = (high << 5) + high ^ text.charCodeAt(index);
        low = (low << 5) + low ^ text.charCodeAt(index);
    }
    return (high >>> 0).toString(36) + (low >>> 0).toString(36);
}