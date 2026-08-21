// NextJS Flight Data extractor & search
// Extraction part from https://github.com/alcoceba/next.js-explorer

import { GetBytesFromBase64, GetUTF8FromBytes } from './BufferEncoder';

const INLINE_FLIGHT_PAYLOAD_BOOTSTRAP = 0;
const INLINE_FLIGHT_PAYLOAD_DATA = 1;
// const INLINE_FLIGHT_PAYLOAD_FORM_STATE = 2;
const INLINE_FLIGHT_PAYLOAD_BINARY = 3;

export function ExtractNextJS<T extends JSONElement>(document: Document, predicate: (data: JSONObject<JSONElement> | JSONArray<JSONElement>) => unknown): T | undefined {
    const rawData = GetRawdata(document);
    const payloads = DecodeData(rawData);

    function search(target: any): T | undefined {
        if (target === null || target === undefined) return undefined;

        //make the predicate fails gracefully.
        //i.e predicate  = ( data => 'something' in data) and target is not an object (string number etc..)
        try {
            if (predicate(target)) {
                return target as T;
            }
        } catch { };

        if (typeof target === 'object') {
            for (const key of Object.keys(target)) {
                const result = search(target[key]);
                if (result !== undefined) {
                    return result; // Short-circuit on first find
                }
            }
        }
        return undefined;
    }

    // Iterate over the root Record<number, any> entries
    if (payloads && typeof payloads === 'object') {
        for (const key of Object.keys(payloads)) {
            const result = search(payloads[key]);
            if (result !== undefined) {
                return result as T;
            }
        }
    }
    return undefined;
}

function GetRawdata(doc: Document): JSONElement {
    const scriptTags = doc.querySelectorAll('script');
    const flightData: any[] = [];

    for (const script of scriptTags) {
        const content = script.textContent || '';
        const args = ParsePushCalls(content);

        for (const arg of args) {
            try {
                const parsed = JSON.parse(arg);
                flightData.push(parsed);
            } catch {
                try {
                    const parsed = new Function('return ' + arg)();
                    if (Array.isArray(parsed)) {
                        flightData.push(parsed);
                    }
                } catch {
                    // Skip malformed entries
                }
            }
        }
    }
    return flightData;
}

function DecodeData(appRawData: any): JSONElement | null {
    if (appRawData) {
        const flightRawData: string[] = [];

        for (const chunk of appRawData) {
            // Next.js 16+ format: tuples like [0], [1, "data"], [2, formState], [3, "base64"]
            if (Array.isArray(chunk)) {
                const [type, data] = chunk;

                // Bootstrap marker - skip
                if (type === INLINE_FLIGHT_PAYLOAD_BOOTSTRAP) {
                    continue;
                }

                // Text data chunk (most common)
                if (type === INLINE_FLIGHT_PAYLOAD_DATA && typeof data === 'string') {
                    flightRawData.push(data);
                    continue;
                }

                // Binary data chunk (base64 encoded) - Next.js 16+
                if (type === INLINE_FLIGHT_PAYLOAD_BINARY && typeof data === 'string') {
                    const decoded = GetUTF8FromBytes(GetBytesFromBase64(data));
                    if (decoded) {
                        flightRawData.push(decoded);
                    }
                    continue;
                }

                // Fallback for older Next.js 15 format or unknown tuple formats:
                // Try to extract any string data from the array
                for (const inner of chunk) {
                    if (typeof inner === 'string') {
                        flightRawData.push(inner);
                    }
                }
            } else if (typeof chunk === 'string') {
                // Legacy format: direct strings in the array
                flightRawData.push(chunk);
            }
        }

        // Join without adding extra newlines - the data already contains proper line breaks
        const flightString = flightRawData.join('');

        return ParseFlightPushData(flightString);
    }
    return null;
}

function ParseFlightPushData(flightChunk: string): any[] | undefined {
    if (typeof flightChunk !== 'string') {
        return;
    }

    const parsed: any[] = [];
    let pos = 0;
    const len = flightChunk.length;

    const readUntilNewline = (start: number): { line: string; nextPos: number } => {
        const end = flightChunk.indexOf('\n', start);
        return {
            line: flightChunk.slice(start, end === -1 ? len : end),
            nextPos: end === -1 ? len : end + 1,
        };
    };

    while (pos < len) {
        // Skip empty/whitespace-only lines
        if (flightChunk[pos] === '\n') {
            pos++;
            continue;
        }

        const colonIndex = flightChunk.indexOf(':', pos);
        if (colonIndex === -1) {
            break;
        }

        const key = flightChunk.slice(pos, colonIndex);
        if (!/^\w+$/.test(key)) {
            // Malformed key; skip to the next newline and try again
            const nextNewline = flightChunk.indexOf('\n', pos);
            pos = nextNewline === -1 ? len : nextNewline + 1;
            continue;
        }

        const afterColon = colonIndex + 1;
        if (afterColon >= len) {
            break;
        }

        const typeChar = flightChunk[afterColon];

        // Symbol reference (e.g., "$Sreact.fragment", "$SR19")
        if (typeChar === '"') {
            const { line, nextPos } = readUntilNewline(afterColon);
            const value = line.slice(1, -1);
            const type = line.startsWith('"$S') ? 'Symbol' : 'Data';
            if (type === 'Symbol') {
                parsed.push({ type, key, value });
            } else {
                try {
                    parsed.push({ type: 'Data', key, content: JSON.parse(line) });
                } catch {
                    parsed.push({ type: 'Unknown', key, value: line });
                }
            }
            pos = nextPos;
        }
        // Text content
        else if (typeChar === 'T') {
            if (flightChunk[afterColon + 1] === '"') {
                // Legacy quoted format: T"text"
                const { line, nextPos } = readUntilNewline(afterColon);
                parsed.push({ type: 'Text', key, value: line.slice(2, -1) });
                pos = nextPos;
            } else {
                // Length-prefixed format: T<hex_len>,<text>
                const commaIndex = flightChunk.indexOf(',', afterColon);
                if (commaIndex === -1) {
                    // Malformed; fall back to consuming the rest of the line
                    const { line, nextPos } = readUntilNewline(afterColon);
                    parsed.push({ type: 'Text', key, value: line.slice(1) });
                    pos = nextPos;
                    continue;
                }

                const hexLen = flightChunk.slice(afterColon + 1, commaIndex);
                const length = parseInt(hexLen, 16);
                const textStart = commaIndex + 1;

                // Extract exactly `length` UTF-8 bytes from the remaining string.
                // Each JS character needs at most 4 UTF-8 bytes, so a window of
                // `length` characters is guaranteed to cover `length` bytes.
                const remainingChars = len - textStart;
                const maxChars = Math.min(remainingChars, length);
                const windowStr = flightChunk.slice(textStart, textStart + maxChars);
                const windowBytes = new TextEncoder().encode(windowStr);

                let text: string;
                if (windowBytes.length < length) {
                    // Not enough bytes left; take everything we have
                    text = flightChunk.slice(textStart);
                    pos = len;
                } else {
                    const textBytes = windowBytes.slice(0, length);
                    text = new TextDecoder().decode(textBytes);
                    pos = textStart + text.length;
                }

                parsed.push({ type: 'Text', key, length, value: text });

                // Text rows may optionally be followed by a newline
                if (pos < len && flightChunk[pos] === '\n') {
                    pos++;
                }
            }
        }
        // Instance/Import reference
        else if (typeChar === 'I') {
            const { line, nextPos } = readUntilNewline(afterColon);
            try {
                const content = JSON.parse(line.slice(1));
                parsed.push({ type: 'Instance', key, content });
            } catch {
                parsed.push({ type: 'Instance', key, raw: line });
            }
            pos = nextPos;
        }
        // List/Array
        else if (typeChar === 'L') {
            const { line, nextPos } = readUntilNewline(afterColon);
            try {
                const list = JSON.parse(line.slice(1));
                parsed.push({ type: 'List', key, content: list });
            } catch {
                parsed.push({ type: 'List', key, raw: line });
            }
            pos = nextPos;
        }
        // Object
        else if (typeChar === 'O') {
            const { line, nextPos } = readUntilNewline(afterColon);
            try {
                const obj = JSON.parse(line.slice(1));
                parsed.push({ type: 'Object', key, content: obj });
            } catch {
                parsed.push({ type: 'Object', key, raw: line });
            }
            pos = nextPos;
        }
        // Hints (Next.js 16+ for preloading resources)
        else if (typeChar === 'H') {
            const { line, nextPos } = readUntilNewline(afterColon);
            try {
                const hints = JSON.parse(line.slice(1));
                parsed.push({ type: 'Hints', key, content: hints });
            } catch {
                parsed.push({ type: 'Hints', key, raw: line });
            }
            pos = nextPos;
        }
        // Binary/Blob reference (Next.js 16+)
        else if (typeChar === 'B') {
            const { line, nextPos } = readUntilNewline(afterColon);
            parsed.push({ type: 'Binary', key, raw: line });
            pos = nextPos;
        }
        // Module reference (for lazy loading)
        else if (typeChar === 'M') {
            const { line, nextPos } = readUntilNewline(afterColon);
            try {
                const module = JSON.parse(line.slice(1));
                parsed.push({ type: 'Module', key, content: module });
            } catch {
                parsed.push({ type: 'Module', key, raw: line });
            }
            pos = nextPos;
        }
        // Default: try to parse as JSON
        else {
            const { line, nextPos } = readUntilNewline(afterColon);
            try {
                const data = JSON.parse(line);
                parsed.push({ type: 'Data', key, content: data });
            } catch {
                parsed.push({ type: 'Unknown', key, value: line });
            }
            pos = nextPos;
        }
    }

    return parsed;
}

function ParsePushCalls(content: string): string[] {
    const args: string[] = [];
    const prefix = 'self.__next_f.push(';
    let searchStart = 0;

    while (true) {
        const callIndex = content.indexOf(prefix, searchStart);
        if (callIndex === -1) break;

        const openParen = callIndex + prefix.length;
        let depth = 0;
        let inString = false;
        let stringChar: string | null = null;
        let escape = false;
        let i = openParen;

        for (; i < content.length; i++) {
            const ch = content[i];

            if (escape) {
                escape = false;
                continue;
            }

            if (ch === '\\') {
                escape = true;
                continue;
            }

            if (inString) {
                if (ch === stringChar) inString = false;
                continue;
            }

            if (ch === '"' || ch === "'") {
                inString = true;
                stringChar = ch;
                continue;
            }

            if (ch === '(') {
                depth++;
            } else if (ch === ')') {
                if (depth === 0) break;
                depth--;
            }
        }

        args.push(content.slice(openParen, i));
        searchStart = i + 1;
    }
    return args;
}