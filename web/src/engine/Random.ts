/**
 * A pseudo-random generator providing 32-bit integers.
 */
export type IntegerPRNG = Generator<number, never, never>;

/**
 * A pseudo-random generator providing normalized floating point values in the range `[0, 1)` - 0 inclusive, 1 exclusive.
 */
export type NormalizedPRNG = Generator<number, never, never>;

export function RandomFloat(max: number, min: number = 0) {
    return Math.random() * (max - min) + min;
}

export function RandomInt(max: number, min: number = 0) {
    return Math.round(RandomFloat(Math.ceil(min), Math.floor(max)));
}

export function RandomBytes(length: number): Uint8Array<ArrayBuffer> {
    return crypto.getRandomValues(new Uint8Array(length));
}

export function RandomUTF8(length: number) {
    return RandomBytes(length).join('').slice(0, length);
}

export function RandomHex(length: number) {
    const bytes = RandomBytes(length);
    return Array.from(bytes).map(byte => byte.toString(16)).join('').slice(0, length);
}

export function RandomText(length: number) {
    const bytes = RandomBytes(length);
    return Array.from(bytes).map(byte => byte.toString(36)).join('').slice(0, length);
}

/**
 * Creates a PRNG (pseudo random number generator) based on the **XorShift32** algorithm with the given {@link seed} as initial state.
 * When the seed is `0` all consecutive values will also be `0`.
 */
export function* XorShift32(seed: number): IntegerPRNG {
    for (let state = seed >>> 0; ;) {
        state ^= state << 13;
        state ^= state >>> 17;
        state ^= state << 5;
        yield state >>> 0;
    }
}

/**
 * Creates a Mulberry32 PRNG
 */
export function* Mulberry32(seed: number): IntegerPRNG {
    for (let state = seed >>> 0; ;) {
        state = state + 0x6D2B79F5 | 0;
        let result = Math.imul(state ^ state >>> 15, state | 1);
        result ^= Math.imul(result ^ result >>> 7, result | 61) + result;
        yield (result ^ result >>> 14) >>> 0;
    }
}

/**
 * Creates a PRNG (pseudo random number generator) based on the **Linear Congruential** algorithm with the given {@link seed} as initial state.
 * The {@link modulo} parameter should not exceed the 32-bit limit.
 */
export function* LCG(seed: number, multiplier = 1664525, increment = 1013904223, modulo = 2**32): IntegerPRNG {
    for (let state = seed >>> 0; ;) {
        state = (state * multiplier + increment) % modulo;
        yield state >>> 0;
    }
}

export class FisherYates {

    constructor(private readonly deriveSwapIndex: (index: number) => number) { }

    /**
     * Create a new {@link FisherYates} instance which derives each destination index from a source index via scaling operation.
     * The iterator {@link normalizedNumbers} must exclusively provide normalized floating point numbers in the range `[0, 1)`.
     */
    public static WithScaledDerivation(normalizedNumbers: Iterator<number>) {
        return new FisherYates(index => Math.floor(normalizedNumbers.next().value * (index + 1)));
    }

    /**
     * Create a new {@link FisherYates} instance which derives each destination index from a source index via modulo operation.
     * The iterator {@link integerNumbers} must exclusively provide 32-bit numbers.
     */
    public static WithModuloDerivation(integerNumbers: Iterator<number>) {
        return new FisherYates(index => integerNumbers.next().value % (index + 1));
    }

    /**
     * Shuffle the given {@link values} with the Fisher-Yates algorithm
     * using the provided {@link deriveSwapIndex} function to infer the destination index for each source index.
     */
    public Shuffle<T>(...values: T[]) {
        for (let srcIndex = values.length - 1; srcIndex > 0; srcIndex--) {
            const dstIndex = this.deriveSwapIndex(srcIndex);
            [values[srcIndex], values[dstIndex]] = [values[dstIndex], values[srcIndex]];
        }
        return values;
    }
}