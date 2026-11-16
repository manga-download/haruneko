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
        yield state >>> 0;
    }
}

/** Creates a Mulberry32 PRNG yielding unsigned 32-bit integers. */
export function* Mulberry32(seed: number): PseudoRNG {
    for (let state = seed >>> 0; ;) {
        state = state + 0x6D2B79F5 | 0;
        let result = Math.imul(state ^ state >>> 15, state | 1);
        result = result + Math.imul(result ^ result >>> 7, result | 61) ^ result;
        yield (result ^ result >>> 14) >>> 0;
    }
}

/** Converts a PRNG yielding unsigned 32-bit integers to values in [0, 1). */
export function* ToUnitInterval(pseudoRNG: PseudoRNG): PseudoRNG {
    for (;;) {
        yield pseudoRNG.next().value / 2**32;
    }
}

/**
 * Creates a PRNG (pseudo random number generator) based on the **Linear Congruential** algorithm with the given {@link seed} as initial state.
 * The {@link modulo} parameter should not exceed the 32-bit limit.
 */
export function* LCG(seed: number, multiplier = 1664525, increment = 1013904223, modulo = 2**32): PseudoRNG {
    for (let state = seed >>> 0; ;) {
        state = (state * multiplier + increment) % modulo;
        yield state >>> 0;
    }
}

export class FisherYates {

    /** Use `fraction` for generators producing values in [0, 1), or `modulo` for integer generators. */
    constructor(private readonly pseudoRNG: PseudoRNG, private readonly indexMode: 'modulo' | 'fraction' = 'modulo') { }

    /** Shuffle the given {@link values} using the supplied generator. */
    public Shuffle<T>(...values: T[]) {
        for (let srcIndex = values.length - 1; srcIndex > 0; srcIndex--) {
            const random = this.pseudoRNG.next().value;
            const dstIndex = this.indexMode === 'fraction'
                ? Math.floor(random * (srcIndex + 1))
                : random % (srcIndex + 1);
            [values[srcIndex], values[dstIndex]] = [values[dstIndex], values[srcIndex]];
        }
        return values;
    }
}