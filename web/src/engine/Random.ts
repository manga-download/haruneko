/** A pseudo-random generator yielding normalized values in the range [0, 1). */
export type PseudoRNG = Generator<number, never, never>;

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
export function* XorShift32(seed: number): PseudoRNG {
    for (let state = seed >>> 0; ;) {
        state ^= state << 13;
        state ^= state >>> 17;
        state ^= state << 5;
        yield (state >>> 0) / 2 ** 32;
    }
}

/** Creates a Mulberry32 PRNG **/
export function* Mulberry32(seed: number): PseudoRNG {
    for (let state = seed >>> 0; ;) {
        state = state + 0x6D2B79F5 | 0;
        let result = Math.imul(state ^ state >>> 15, state | 1);
        result ^= Math.imul(result ^ result >>> 7, result | 61) + result;
        yield ((result ^ result >>> 14) >>> 0) / 2 ** 32;
    }
}

/**
 * Creates a PRNG (pseudo random number generator) based on the **Linear Congruential** algorithm with the given {@link seed} as initial state.
 * The {@link modulo} parameter should not exceed the 32-bit limit.
 */
export function* LCG(seed: number, multiplier = 1664525, increment = 1013904223, modulo = 2**32): PseudoRNG {
    for (let state = seed >>> 0; ;) {
        state = (state * multiplier + increment) % modulo;
        yield state / 2 ** 32;
    }
}

export class FisherYates {

    constructor(private readonly deriveSwapIndex: (index: number) => number) { }

    /**
     * Create a new {@link FisherYates} instance which derives each destination index from a source index via scaling operation.
     * The provided pseudo random number generator must provide normalized floating point values in the range `[0, 1)` - 0 inclusive, 1 exclusive.
     */
    public static WithScaledDerivation(prng: PseudoRNG) {
        return new FisherYates(index => Math.floor(prng.next().value * (index + 1)));
    }

    /**
     * Create a new {@link FisherYates} instance which derives each destination index from a source index via modulo operation.
     * The provided generator must yield 32-bit integers normalized by dividing by 2**32.
     */
    public static WithModuloDerivation(prng: PseudoRNG) {
        return new FisherYates(index => prng.next().value * 2 ** 32 % (index + 1));
    }

    /**
     * Shuffle the given {@link values} with the Fisher-Yates algorithm
     * using the provided {@link deriveSwapIndex} function to derive the destination index for each source index.
     */
    public Shuffle<T>(...values: T[]) {
        //stop before index 0 because it will always swap with itself.
        //we should NOT make a useless PRNG call in case the PRNG is shared and reused after.
        for (let srcIndex = values.length - 1; srcIndex > 0; srcIndex--) {
            const dstIndex = this.deriveSwapIndex(srcIndex);
            [values[srcIndex], values[dstIndex]] = [values[dstIndex], values[srcIndex]];
        }
        return values;
    }
}