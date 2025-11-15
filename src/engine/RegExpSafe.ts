declare global {
    /**
     * Use a regular expression that is expected to be safe against [ReDoS](https://en.wikipedia.org/wiki/ReDoS) attacks.
     * @remarks The regular expression is either constant and under the full control of the developer, or the related (user) input for this regular expression was properly sanitized.
     */
    var RegExpSafe: RegExpConstructor;
}

if (!globalThis.RegExpSafe) {
    Object.defineProperty(globalThis, 'RegExpSafe', {
        value: RegExp,
        enumerable: false,
    });
}

// Dummy export to satisfy requirements of being a module
export {};