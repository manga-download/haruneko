import { GetBytesFromUTF8, GetHexFromBytes } from '../BufferEncoder';
import { HashUTF8 } from '../Crypto';

class SeedRandom {
    private readonly state = Array.from({ length: 256 }, (_, i) => i);
    private i = 0;
    private j = 0;

    constructor(seed: string) {
        const key = new Uint8Array(Math.min(seed.length, 256) || 1);
        let smear = 0;
        for (let i = 0; i < seed.length; i++) {
            const index = i & 255;
            smear ^= key[index] * 19;
            key[index] = smear + seed.charCodeAt(i) & 255;
        }
        let j = 0;
        for (let i = 0; i < 256; i++) {
            j = j + this.state[i] + key[i % key.length] & 255;
            [this.state[i], this.state[j]] = [this.state[j], this.state[i]];
        }
        this.Generate(256);
    }

    private Generate(count: number): number {
        let value = 0;
        for (let n = 0; n < count; n++) {
            this.i = this.i + 1 & 255;
            const t = this.state[this.i];
            this.j = this.j + t & 255;
            const s = this.state[this.j];
            this.state[this.i] = s;
            this.state[this.j] = t;
            value = value * 256 + this.state[s + t & 255];
        }
        return value;
    }

    NextDouble(): number {
        let n = this.Generate(6);
        let d = 256 ** 6;
        let x = 0;
        while (n < 2 ** 52) {
            n = (n + x) * 256;
            d *= 256;
            x = this.Generate(1);
        }
        while (n >= 2 ** 53) {
            n /= 2;
            d /= 2;
            x = x >>> 1;
        }
        return (n + x) / d;
    }
}

class Mulberry32 {
    private state: number;

    constructor(state: number) {
        this.state = state | 0;
    }

    NextDouble(): number {
        this.state = this.state + 0x6D2B79F5 | 0;
        let t = Math.imul(this.state ^ this.state >>> 15, this.state | 1);
        t = t + Math.imul(t ^ t >>> 7, t | 61) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296.0;
    }

    NextInt(bound: number): number {
        return Math.floor(this.NextDouble() * bound);
    }
}

type Tile = {
    x: number;
    y: number;
    width: number;
    height: number;
};

type Transform = { rot: number; flipH: boolean; flipV: boolean };
type Move = { src: number; transform: Transform };

export class CanvaDescrambler {
    public static async Decramble(pixels: Uint8ClampedArray, width: number, height: number, chapterId: string, token: string): Promise<Uint8ClampedArray<ArrayBuffer>> {
        const hmacKey = await crypto.subtle.importKey('raw', GetBytesFromUTF8(token), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
        const key = GetHexFromBytes(new Uint8Array(await crypto.subtle.sign('HMAC', hmacKey, GetBytesFromUTF8(chapterId))));
        const splitRng = new SeedRandom(key);
        const cols = this.Split(width, splitRng);
        const rows = this.Split(height, splitRng);
        const tiles: Tile[] = [];
        let y = 0;
        for (const h of rows) {
            let x = 0;
            for (const w of cols) {
                tiles.push({ x, y, width: w, height: h });
                x += w;
            }
            y += h;
        }

        const classes = new Map<string, number[]>();
        tiles.forEach((tile, i) => {
            const size = `${tile.width}x${tile.height}`;
            if (!classes.has(size)) classes.set(size, []);
            classes.get(size)!.push(i);
        });

        const moves = new Map<number, Move>();
        const done = new Set<string>();
        for (const [a, members] of classes) {
            if (done.has(a)) continue;
            done.add(a);
            const [w, h] = a.split('x').map(Number);
            const square = w === h;
            const b = `${h}x${w}`;
            const partner = b === a ? undefined : classes.get(b);
            if (!partner) {
                const order = [...members];
                this.Shuffle(order, new SeedRandom(`${key}|perm|${a}`));
                members.forEach((slot, i) => moves.set(slot, { src: order[i], transform: this.Transform(new SeedRandom(`${key}|tf|self|${a}|${i}`), false, square) }));
                continue;
            }
            done.add(b);
            const pairRng = new SeedRandom(`${key}|pair|${a}|${b}`);
            const sa = [...members];
            const sb = [...partner];
            this.Shuffle(sa, pairRng);
            this.Shuffle(sb, pairRng);
            const count = Math.min(sa.length, sb.length);
            for (let i = 0; i < count; i++) {
                moves.set(sa[i], { src: sb[i], transform: this.Transform(new SeedRandom(`${key}|tf|AtoB|${a}|${i}`), true, false) });
                moves.set(sb[i], { src: sa[i], transform: this.Transform(new SeedRandom(`${key}|tf|BtoA|${b}|${i}`), true, false) });
            }
            this.RestMoves(sa.slice(count), `${key}|perm|A|${a}`, `${key}|tf|A|${a}|rest`, square, moves);
            this.RestMoves(sb.slice(count), `${key}|perm|B|${b}`, `${key}|tf|B|${b}|rest`, square, moves);
        }

        const out = new Uint8ClampedArray(pixels.length).fill(255);
        for (const [slot, move] of moves) {
            this.Draw(pixels, width, tiles[move.src], out, tiles[slot], move.transform);
        }
        return out;
    }

    private static Split(total: number, rng: SeedRandom): number[] {
        let count = Math.max(1, Math.round(total / 222));
        while (Math.floor(total / count) > 259) count++;
        while (Math.floor(total / count) < 185 && count > 1) count--;
        const base = Math.floor(total / count);
        const remainder = total - base * count;
        const sizes = Array.from({ length: count }, (_, i) => base + (i < remainder ? 1 : 0));
        this.Shuffle(sizes, rng);
        return sizes;
    }

    private static Shuffle(list: number[], rng: SeedRandom): void {
        for (let i = list.length - 1; i > 0; i--) {
            const j = Math.floor(rng.NextDouble() * (i + 1));
            [list[i], list[j]] = [list[j], list[i]];
        }
    }

    private static Transform(rng: SeedRandom, swap: boolean, square: boolean): Transform {
        const r = rng.NextDouble();
        const rot = swap ? r < 0.5 ? 1 : 3 : square ? Math.floor(r * 4) : r < 0.5 ? 0 : 2;
        return { rot, flipH: rng.NextDouble() < 0.5, flipV: rng.NextDouble() < 0.5 };
    }

    private static RestMoves(rest: number[], permSeed: string, tfSeed: string, square: boolean, moves: Map<number, Move>): void {
        if (rest.length === 0) return;
        const order = [...rest];
        this.Shuffle(order, new SeedRandom(permSeed));
        rest.forEach((slot, i) => moves.set(slot, { src: order[i], transform: this.Transform(new SeedRandom(`${tfSeed}|${i}`), false, square) }));
    }

    private static Draw(pixels: Uint8ClampedArray, width: number, src: Tile, out: Uint8ClampedArray, dst: Tile, tf: Transform): void {
        const [r00, r01, r10, r11] = [[1, 0, 0, 1], [0, 1, -1, 0], [-1, 0, 0, -1], [0, -1, 1, 0]][tf.rot];
        const odd = tf.rot % 2 === 1;
        const outW = odd ? src.height : src.width;
        const outH = odd ? src.width : src.height;
        const sx = tf.flipH ? -1 : 1;
        const sy = tf.flipV ? -1 : 1;
        const a00 = r00 * sx, a01 = r01 * sy, a10 = r10 * sx, a11 = r11 * sy;
        const t2x = tf.flipH ? outW : 0;
        const t2y = tf.flipV ? outH : 0;
        const [t1x, t1y] = [[0, 0], [0, outW], [outW, outH], [outH, 0]][tf.rot];
        const bx = r00 * t2x + r01 * t2y + t1x + (a00 + a01 < 0 ? -1 : 0);
        const by = r10 * t2x + r11 * t2y + t1y + (a10 + a11 < 0 ? -1 : 0);

        for (let y = 0; y < src.height; y++) {
            for (let x = 0; x < src.width; x++) {
                const ox = a00 * x + a01 * y + bx;
                const oy = a10 * x + a11 * y + by;
                if (ox >= 0 && ox < outW && oy >= 0 && oy < outH) {
                    const source = ((src.y + y) * width + src.x + x) * 4;
                    const target = ((dst.y + oy) * width + dst.x + ox) * 4;
                    for (let channel = 0; channel < 4; channel++) out[target + channel] = pixels[source + channel];
                }
            }
        }
    }
}

export class Canva2Descrambler {
    private static readonly GRID = 8;
    private static readonly SALT = '6a0248ad1ca4208275aed64d336e81595ecb149422a8e621f70e23b9f01b9c1c';

    public static async Decramble(pixels: Uint8ClampedArray, width: number, height: number, chapterId: string): Promise<Uint8ClampedArray<ArrayBuffer>> {

        const GRID = Canva2Descrambler.GRID;
        const h1 = GetHexFromBytes(await HashUTF8('SHA-256', chapterId + Canva2Descrambler.SALT));
        const h2 = await HashUTF8('SHA-256', `${h1}:nxn:${GRID}:${width}x${height}`);

        const seed = new DataView(h2.buffer, h2.byteOffset, h2.byteLength).getInt32(0, false);
        const rng = new Mulberry32(seed);

        const tileW = Math.floor(width / GRID);
        const tileH = Math.floor(height / GRID);
        const extraW = width - tileW * GRID;
        const extraH = height - tileH * GRID;

        const tiles: Tile[] = [];
        let currentY = 0;
        for (let r = 0; r < GRID; r++) {
            const h = r < extraH ? tileH + 1 : tileH;
            let currentX = 0;
            for (let c = 0; c < GRID; c++) {
                const w = c < extraW ? tileW + 1 : tileW;
                tiles.push({ x: currentX, y: currentY, width: w, height: h });
                currentX += w;
            }
            currentY += h;
        }

        const classes = new Map<string, number[]>();
        tiles.forEach((t, i) => {
            const key = `${t.width},${t.height}`;
            if (!classes.has(key)) {
                classes.set(key, []);
            }
            classes.get(key)!.push(i);
        });

        const sources = new Map<string, number[]>();
        const rotations = new Map<string, number[]>();

        for (const [key, members] of classes.entries()) {
            const [wStr, hStr] = key.split(',');
            const tw = parseInt(wStr, 10);
            const th = parseInt(hStr, 10);

            const order = [...members];
            for (let count = order.length; count >= 2; count--) {
                const j = rng.NextInt(count);
                const temp = order[count - 1];
                order[count - 1] = order[j];
                order[j] = temp;
            }
            sources.set(key, order);

            const rotList: number[] = [];
            for (let i = 0; i < order.length; i++) {
                if (tw === th) {
                    rotList.push(rng.NextInt(4));
                } else if (rng.NextDouble() < 0.5) {
                    rotList.push(0);
                } else {
                    rotList.push(2);
                }
            }
            rotations.set(key, rotList);
        }

        const out = new Uint8ClampedArray(pixels.length);
        const position = new Map<string, number>();

        tiles.forEach(dst => {
            const key = `${dst.width},${dst.height}`;
            const pos = position.get(key) || 0;
            position.set(key, pos + 1);

            const srcIndex = sources.get(key)![pos];
            const src = tiles[srcIndex];
            const rotation = rotations.get(key)![pos];

            Canva2Descrambler.Draw(pixels, width, src, out, dst, rotation);
        });

        return out;
    }

    private static Draw(pixels: Uint8ClampedArray, width: number, src: Tile, out: Uint8ClampedArray, dst: Tile, rotation: number) {
        const w = dst.width;
        const h = dst.height;
        for (let r = 0; r < h; r++) {
            for (let c = 0; c < w; c++) {
                let y = 0, x = 0;
                switch (rotation) {
                    case 1:
                        y = c;
                        x = h - 1 - r;
                        break;
                    case 2:
                        y = h - 1 - r;
                        x = w - 1 - c;
                        break;
                    case 3:
                        y = w - 1 - c;
                        x = r;
                        break;
                    default:
                        y = r;
                        x = c;
                        break;
                }
                const source = ((src.y + r) * width + src.x + c) * 4;
                const target = ((dst.y + y) * width + dst.x + x) * 4;
                for (let channel = 0; channel < 4; channel++) {
                    out[target + channel] = pixels[source + channel];
                }
            }
        }
    }
}