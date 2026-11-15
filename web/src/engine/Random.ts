type PseudoRNG = Generator<number, never, never>;

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
 * Creates a XorShift32 PRNG (pseudo random number generator) with the given {@link seed} as initial state.
 * When the seed is `0` all consequitive values will also be `0`.
 */
export function* XorShift32(seed: number): PseudoRNG {
    for (let state = seed >>> 0; ;) {
        state ^= state << 13;
        state ^= state >>> 17;
        state ^= state << 5;
        yield state >>> 0;
    }
}

export class FisherYates {

    constructor(private readonly pseudoRNG: PseudoRNG) { }

    /**
     * Shuffle the given {@link values} with the Fisher-Yates algorithm using the provided {@link prng} generator.
     */
    public Shuffle<T>(...values: T[]) {
        for (const srcIndex of [...values.keys()].reverse()) {
            const dstIndex = this.pseudoRNG.next().value % (srcIndex + 1);
            [values[srcIndex], values[dstIndex]] = [values[dstIndex], values[srcIndex]];
        }
        return values;
    }
}