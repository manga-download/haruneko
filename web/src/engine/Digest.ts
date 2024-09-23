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