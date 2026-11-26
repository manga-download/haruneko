import { GetBytesFromUTF8 } from "../BufferEncoder";

export type PageSlice = {
    slice1Width: number;
    slice2Width: number;
    slice1Flip: number;
    slice2Flip: number;
    extraParam4: number;
    slice1SrcX: number;
    slice2SrcX: number;
};

export class DrmProvider {
    private static FNV_OFFSET_BASIS = 2166136261 >>> 0;
    private static ASCII_COLON = 0x3a; // ':'
    private static ASCII_ZERO = 0x30; // '0'
    private static SALT = GetBytesFromUTF8('MangaTR_Wasm_Shield_2026!');

    private Fnv1aStep(hash: number, byte: number): number {
        return Math.imul(hash >>> 0 ^ byte & 0xff, 16777619) >>> 0;
    }

    private Fnv1a16Step(hash16: number, byte: number): number {
        return this.Fnv1aStep(hash16 & 0xffff, byte) & 0xffff;
    }

    //mtr_sign from WASM
    private Sign(ticketBytes: Uint8Array, timestamp: number): number {
        let hash = DrmProvider.FNV_OFFSET_BASIS;

        // 1. Ticket bytes
        for (let i = 0; i < ticketBytes.length; i++) {
            hash = this.Fnv1aStep(hash, ticketBytes[i]);
        }

        // 2. ':' separator
        hash = this.Fnv1aStep(hash, DrmProvider.ASCII_COLON);

        // 3. Decimal ASCII digits of timestamp (unsigned 32-bit)
        const tsDigits = GetBytesFromUTF8(String(timestamp >>> 0));
        for (let i = 0; i < tsDigits.length; i++) {
            hash = this.Fnv1aStep(hash, tsDigits[i]);
        }

        // 4. ':' separator
        hash = this.Fnv1aStep(hash, DrmProvider.ASCII_COLON);

        // 5. Data segment ("MangaTR_Wasm_Shield_2026!")
        for (let i = 0; i < DrmProvider.SALT.length; i++) {
            hash = this.Fnv1aStep(hash, DrmProvider.SALT[i]);
        }

        return hash >>> 0;
    }

    public BuildSignedPayloadPure(ticket: string, readerSid: string): Uint8Array {

        const ticketBytes = GetBytesFromUTF8(ticket);
        const sidBytes = GetBytesFromUTF8(readerSid);
        const timestamp = Math.floor(Date.now() / 1000);

        const signature = this.Sign(ticketBytes, timestamp);
        const totalLength = 10 + ticketBytes.length + 1 + sidBytes.length;
        const packet = new Uint8Array(totalLength);
        const view = new DataView(packet.buffer);

        let pos = 0;
        packet[pos++] = 20;
        view.setUint32(pos, timestamp >>> 0, true);
        pos += 4;
        view.setUint32(pos, signature, true);
        pos += 4;

        packet[pos++] = ticketBytes.length;
        packet.set(ticketBytes, pos);
        pos += ticketBytes.length;

        packet[pos++] = sidBytes.length;
        packet.set(sidBytes, pos);

        for (let i = 1; i < totalLength; i++) {
            packet[i] ^= 94 + i & 0xff;
        }

        return packet;
    }

    private ComputeSeed(idx: number, ticketBytes: Uint8Array): number {
        const unsignedIdx = idx >>> 0;
        const digits: number[] = [];

        if (unsignedIdx === 0) {
            digits.push(DrmProvider.ASCII_ZERO);
        } else {
            let remaining = unsignedIdx;
            while (remaining > 0) {
                digits.unshift(DrmProvider.ASCII_ZERO + remaining % 10);
                remaining = Math.floor(remaining / 10);
            }
        }

        let state = DrmProvider.FNV_OFFSET_BASIS;
        for (let i = 0; i < digits.length; i++) {
            state = this.Fnv1a16Step(state, digits[i]);
        }

        state = this.Fnv1a16Step(state, DrmProvider.ASCII_COLON);

        for (let i = 0; i < ticketBytes.length; i++) {
            state = this.Fnv1a16Step(state, ticketBytes[i]);
        }

        return state & 0xffff;
    }

    //mtr_plan from WASM
    public GetSlices(idx: number, pageTk: number, ticketBytes: Uint8Array, width: number, _height: number,): PageSlice {
        const w = width >>> 0;
        const f0Result = this.ComputeSeed(idx >>> 0, ticketBytes);
        const mixed = (pageTk >>> 0 ^ f0Result) >>> 0;

        const upper = mixed >>> 14 >>> 0;
        let ratio = (mixed & 16383) >>> 0;
        if (ratio < 2000 || ratio > 8000) {
            ratio = 5000;
        }

        let slice1Width = Math.floor((w * ratio + 5000) / 10000) >>> 0;

        let minMargin = Math.floor(w / 2) >>> 0;
        if (minMargin > 10) {
            minMargin = 10;
        }

        if (slice1Width < minMargin) {
            slice1Width = minMargin;
        }

        const maxSlice1Width = w - minMargin >>> 0;
        if (slice1Width > maxSlice1Width) {
            slice1Width = maxSlice1Width;
        }

        const slice2Width = w - slice1Width >>> 0;
        const slice1Flip = upper % 3 + 1 >>> 0;
        const slice2Flip = Math.floor(upper / 3) % 3 + 1 >>> 0;
        const extraParam4 = upper >= 9 ? 1 : 0;

        const slice1SrcX = extraParam4 !== 0 ? slice2Width : 0;
        const slice2SrcX = extraParam4 !== 0 ? 0 : slice1Width;

        return { slice1Width, slice2Width, slice1Flip, slice2Flip, extraParam4, slice1SrcX, slice2SrcX };
    }
}