declare global {
    var RegExpUnsafe: RegExpConstructor;
}

if (!globalThis.RegExpUnsafe) {
    Object.defineProperty(globalThis, 'RegExpUnsafe', {
        value: RegExp,
        enumerable: false,
    });
}

// Dummy export to satisfy requirements of being a module
export {};