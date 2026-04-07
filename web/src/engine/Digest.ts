function DJB2(text: string, seed = 5381): number {
    let hash = seed;
    for (let index = text.length - 1; index > -1; index--) {
        hash = (hash << 5) + hash ^ text.charCodeAt(index);
    }
    return hash >>> 0
}

export enum Format {
    Dec,
    Hex,
    Alpha,
};

export function Hash32(text: string, format: Format.Dec): number;
export function Hash32(text: string, format: Format.Hex): string;
export function Hash32(text: string, format: Format.Alpha): string;
export function Hash32(text: string, format = Format.Dec) {
    switch (format) {
        case Format.Dec:
            return DJB2(text);
        case Format.Hex:
            return DJB2(text).toString(16).toUpperCase().padStart(8, '0');
        case Format.Alpha:
            return DJB2(text).toString(36);
        default:
            throw new RangeError();
    }
}

/**
 * Customized 64-Bit checksum calculation based on two concatenated DJB2 algorithms to reduce the probability of hash collisions.
 */
export function DJB2x64(text: string, seed = 5381) {
    let low = seed;
    let high = ~seed;
    for (let index = 0; index < text.length; index++) {
        low = (low << 5) + low ^ text.charCodeAt(index);
        high = (high << 5) + high ^ text.charCodeAt(index);
    }
    //return (high >>> 0).toString(36) + (low >>> 0).toString(radix);
    return BigInt(high >>> 0) << 32n | BigInt(low >>> 0);
}

export function Hash64(text: string, format: Format.Dec): number;
export function Hash64(text: string, format: Format.Hex): string;
export function Hash64(text: string, format: Format.Alpha): string;
export function Hash64(text: string, format = Format.Dec) {
    switch (format) {
        case Format.Dec:
            return DJB2(text);
        case Format.Hex:
            return DJB2(text).toString(16).toUpperCase().padStart(16, '0');
        case Format.Alpha:
            return DJB2(text).toString(36);
        default:
            throw new RangeError();
    }
}