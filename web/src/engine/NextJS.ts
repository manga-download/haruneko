// Regular expression to match Next.js App Router flight push chunks
const NEXT_F_REGEX = /self\.__next_f\.push\(\s*(\[.*])\s*\)\s*;?\s*$/s;

/**
 * Extracts a matched value from a Next.js HTML document using a predicate.
 */
export function ExtractNextJS<T extends JSONElement>(doc: Document, predicate: (data: JSONObject<JSONElement> | JSONArray<JSONElement>) => unknown): T | undefined {
    const chunkCache = new Map<string, string>();
    const modelCache = new Map<string, any>();

    const payloads = ExtractAppRouterPayloads(doc, chunkCache, modelCache);

    for (const payload of payloads) {
        const resolvedPayload = ResolveNextJsRefs(payload, chunkCache, modelCache);
        const result = ExtractValueNextJs(resolvedPayload, predicate);
        if (result !== null && result !== undefined) {
            return result as T;
        }
    }

    return undefined;
}

/**
 * Recursively walks a parsed JSON structure to resolve Next.js RSC references using chunk and model caches.
 */
function ResolveNextJsRefs(element: any, chunkCache: Map<string, string>, modelCache: Map<string, any>, resolving: Set<string> = new Set()): any {
    if (Array.isArray(element)) {
        return element.map(item => ResolveNextJsRefs(item, chunkCache, modelCache, resolving));
    }

    if (element !== null && typeof element === 'object') {
        const resolvedObj: Record<string, any> = {};
        for (const [key, value] of Object.entries(element)) {
            resolvedObj[key] = ResolveNextJsRefs(value, chunkCache, modelCache, resolving);
        }
        return resolvedObj;
    }

    if (typeof element === 'string' && element.startsWith('$') && element.length >= 2) {
        const str = element;
        switch (true) {
            case str === '$undefined':
                return null; // JS undefined -> null
            case str === '$Infinity' || str === '$-Infinity' || str === '$NaN' || str === '$-0':
                return str.substring(1); // Non-finite / negative zero token string
            case str[1] === '$':
                return str.substring(1); // Escaped '$' -> keep one
            case str[1] === 'D':
                return str.substring(2); // Date string
            case str[1] === 'n':
                return str.substring(2); // BigInt string
            case str[1] === 'Q':
                return ResolveMapRef(str.substring(2), chunkCache, modelCache, resolving) ?? element;
            case str[1] === 'W':
                return ResolveSetRef(str.substring(2), chunkCache, modelCache, resolving) ?? element;
            default:
                return ResolveModelRef(str.substring(1), chunkCache, modelCache, resolving) ?? element;
        }
    }

    return element;
}

/**
 * Resolves a React Flight reference of the form `<id>` or `<id>:<seg>:<seg>...`.
 */
function ResolveModelRef(reference: string, chunkCache: Map<string, string>, modelCache: Map<string, any>, resolving: Set<string>): any {
    const segments = reference.split(':');
    const id = segments[0];

    if (segments.length === 1 && chunkCache.has(id)) {
        return chunkCache.get(id);
    }

    if (resolving.has(id)) return null; // Cycle guard
    const guard = new Set(resolving).add(id);

    let value = modelCache.get(id);
    if (value === undefined) return null;

    for (let i = 1; i < segments.length; i++) {
        if (typeof value === 'string' && value.startsWith('$')) {
            value = ResolveNextJsRefs(value, chunkCache, modelCache, guard);
        }
        value = WalkRefSegment(value, segments[i]);
        if (value === null || value === undefined) return null;
    }

    return ResolveNextJsRefs(value, chunkCache, modelCache, guard);
}

/**
 * Indexes a value by a single path segment, handling React element tuple shape.
 */
function WalkRefSegment(value: any, segment: string): any {
    if (Array.isArray(value)) {
        // React element tuple ["$", type, key, props]
        if (value.length >= 4 && value[0] === '$') {
            switch (segment) {
                case 'type': return value[1];
                case 'key': return value[2];
                case 'props': return value[3];
                default: {
                    const idx = Number(segment);
                    return !isNaN(idx) ? value[idx] : undefined;
                }
            }
        } else {
            const idx = Number(segment);
            return !isNaN(idx) ? value[idx] : undefined;
        }
    }

    if (value !== null && typeof value === 'object') {
        return value[segment];
    }

    return null;
}

/**
 * Resolves the outlined model map reference at [id] into an object.
 */
function ResolveMapRef(id: string, chunkCache: Map<string, string>, modelCache: Map<string, any>, resolving: Set<string>): any {
    if (resolving.has(id)) return null;
    const entries = modelCache.get(id);
    if (!Array.isArray(entries)) return null;

    const resolved = ResolveNextJsRefs(entries, chunkCache, modelCache, new Set(resolving).add(id));
    if (!Array.isArray(resolved)) return null;

    const resultObj: Record<string, any> = {};
    for (const pair of resolved) {
        if (Array.isArray(pair) && pair.length === 2) {
            const key = pair[0] !== null && typeof pair[0] === 'object' ? String(pair[0]) : pair[0];
            resultObj[key] = pair[1];
        }
    }
    return resultObj;
}

/**
 * Resolves the outlined model set reference at [id] into an array.
 */
function ResolveSetRef(id: string, chunkCache: Map<string, string>, modelCache: Map<string, any>, resolving: Set<string>): any {
    if (resolving.has(id)) return null;
    const values = modelCache.get(id);
    if (!Array.isArray(values)) return null;
    return ResolveNextJsRefs(values, chunkCache, modelCache, new Set(resolving).add(id));
}

/**
 * Extracts raw App Router payloads from inline script tags using DOMParser.
 */
function ExtractAppRouterPayloads(doc: Document, chunkCache: Map<string, string>, modelCache: Map<string, any>): any[] {
    const payloads: any[] = [];
    const scripts = doc.querySelectorAll('script:not([src])');

    scripts.forEach((el) => {
        const script = el.textContent || '';
        if (!script.includes('self.__next_f.push')) return;

        try {
            const match = script.match(NEXT_F_REGEX);
            if (!match) return;

            const arr = JSON.parse(match[1]);
            const content = arr[1];
            if (typeof content !== 'string') return;

            payloads.push(...ExtractRscPayloads(content, chunkCache, modelCache));
        } catch {
            // Ignore parse errors on irrelevant scripts
        }
    });

    return payloads;
}

/**
 * Parses a raw RSC body stream/string into chunks and model caches.
 */
function ExtractRscPayloads(body: string, chunkCache: Map<string, string>, modelCache: Map<string, any>): any[] {
    const results: any[] = [];
    let pos = 0;

    while (pos < body.length) {
        const colonIdx = body.indexOf(':', pos);
        if (colonIdx === -1) break;

        const id = body.substring(pos, colonIdx);
        if (id.length === 0 || !/^[0-9a-fA-F]+$/.test(id)) {
            pos++;
            continue;
        }

        pos = colonIdx + 1;
        if (pos >= body.length) break;

        if (body[pos] === 'T') {
            pos++;
            const commaIdx = body.indexOf(',', pos);
            if (commaIdx === -1) break;

            const byteLen = parseInt(body.substring(pos, commaIdx), 16);
            if (isNaN(byteLen)) break;

            pos = commaIdx + 1;
            let bytes = 0;
            const start = pos;

            while (pos < body.length && bytes < byteLen) {
                const code = body.charCodeAt(pos);
                if (code < 0x80) bytes += 1;
                else if (code < 0x800) bytes += 2;
                else if (code >= 0xD800 && code <= 0xDBFF) {
                    bytes += 4;
                    pos++; // consume high surrogate
                } else {
                    bytes += 3;
                }
                pos++;
            }

            const chunkContent = body.substring(start, pos);
            chunkCache.set(id, chunkContent);

            try {
                results.push(JSON.parse(chunkContent));
            } catch { }
        } else {
            const [element, end] = ParseJsonAt(body, pos);
            if (element !== undefined) {
                results.push(element);
                modelCache.set(id, element);
            }
            pos = end;
        }
    }

    return results;
}

/**
 * Attempts to parse a JSON chunk value safely at a given starting index based on bracket depth.
 */
function ParseJsonAt(body: string, start: number): [any, number] {
    if (start >= body.length) return [undefined, start];

    let depth = 0;
    let inString = false;
    let escape = false;
    let i = start;

    while (i < body.length) {
        const c = body[i++];
        if (escape) {
            escape = false;
            continue;
        }
        if (c === '\\' && inString) {
            escape = true;
            continue;
        }
        if (c === '"') {
            inString = !inString;
            continue;
        }
        if (inString) continue;

        if (c === '{' || c === '[') depth++;
        else if (c === '}' || c === ']') {
            depth--;
            if (depth === 0) {
                try {
                    return [JSON.parse(body.substring(start, i)), i];
                } catch {
                    return [undefined, i];
                }
            }
        }

        if (depth === 0 && /\s/.test(c)) {
            try {
                return [JSON.parse(body.substring(start, i - 1)), i];
            } catch {
                return [undefined, i];
            }
        }
    }

    return [undefined, i];
}

/**
 * Scans the members of the given {@link payload} recursively, searching for the first occurence that fulfills the given {@link predicate}
 * and returns the corresponding value, or `undefined` if non was found.
 */
function ExtractValueNextJs<T extends JSONElement>(payload: JSONElement, predicate: (data: JSONObject<JSONElement> | JSONArray<JSONElement>) => unknown): T {
    if (payload === null || typeof payload !== 'object') return undefined;
    if (predicate(payload)) return payload as T;

    const children = Array.isArray(payload) ? payload : Object.values(payload);
    for (const child of children) {
        const result = ExtractValueNextJs(child, predicate);
        if (result !== null && result !== undefined) return result as T;
    }
    return undefined;
}
