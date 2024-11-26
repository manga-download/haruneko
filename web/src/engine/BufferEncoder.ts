export function FromHexString(hexString: string): Uint8Array {
    return Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
}

export function GetBytesUTF8(text: string): Uint8Array {
    return new TextEncoder().encode(text);
};

export function Uint8ToHexString(array: Uint8Array): string {
    return array.reduce((result, x) => result + x.toString(16).padStart(2, '0'), '');
}

export function BufferToHexString(buffer: ArrayBuffer): string {
    return Uint8ToHexString(new Uint8Array(buffer));
}

export function GetBytesB64(b64string: string): Uint8Array {
    return Uint8Array.from(window.atob(b64string), c => c.charCodeAt(0));
}