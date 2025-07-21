export function RandomFloat(max: number, min: number = 0) {
    return Math.random() * (max - min) + min;
}

export function RandomInt(max: number, min: number = 0) {
    return Math.round(RandomFloat(Math.ceil(min), Math.floor(max)));
}

export function RandomBytes(length: number) {
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