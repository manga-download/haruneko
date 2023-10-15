import { InternalError } from './Error';

export class PlatformInfo {
    constructor(public readonly OS: System, public readonly Runtime: Runtime) {
    }
}

export const enum System {
    Unknown = 'unknown',
    Windows = 'windows',
    MacOS = 'darwin',
    Linux = 'linux',
}

export const enum Runtime {
    Unknown = 'unknown',
    Deno = 'deno',
    Node = 'node',
    NodeWebkit = 'nw',
    Electron = 'electron',
    Chrome = 'chromium', // Blink (Chrome, Edge)
    Gecko = 'gecko', // Gecko|Quantum (Firefox)
    WebKit = 'webkit', // WebKit (Safari)
}

export function CreateUnsupportedPlatformError(info: PlatformInfo): Error {
    return new InternalError(`Unsupported Platform (${info.Runtime}/${info.OS})`);
}

export function DetectPlatform(): PlatformInfo {

    const ua = window?.navigator?.userAgent;
    //const ua = window?.navigator?.userAgentData;

    if(typeof globalThis?.Deno === 'object') {
        return new PlatformInfo(DetectSystemDeno(), Runtime.Deno);
    }

    if(typeof globalThis?.process === 'object') {
        if(typeof globalThis?.nw?.Window === 'object') {
            return new PlatformInfo(DetectSystemBrowser(ua), Runtime.NodeWebkit);
        } else {
            return new PlatformInfo(DetectSystemNode(), Runtime.Node);
        }
    }

    if(/Electron\/\d+/i.test(ua)) {
        return new PlatformInfo(DetectSystemBrowser(ua), Runtime.Electron);
    }

    if(/Chrome\/\d+/.test(ua)) {
        return new PlatformInfo(DetectSystemBrowser(ua), Runtime.Chrome);
    }

    if(/Gecko\/\d+/.test(ua)) {
        return new PlatformInfo(DetectSystemBrowser(ua), Runtime.Gecko);
    }

    if(/Safari\/\d+/.test(ua)) {
        return new PlatformInfo(DetectSystemBrowser(ua), Runtime.WebKit);
    }

    return new PlatformInfo(System.Unknown, Runtime.Unknown);
}

// https://doc.deno.land/deno/stable/~/Deno.build
function DetectSystemDeno() {
    return {
        'windows': System.Windows,
        'darwin': System.MacOS,
        'linux': System.Linux,
    }[globalThis?.Deno?.build?.os as string] || System.Unknown;
}

// https://nodejs.org/api/process.html#process_process_platform
function DetectSystemNode(): System {
    return {
        'win32': System.Windows,
        'darwin': System.MacOS,
        'linux': System.Linux,
    }[globalThis?.process?.platform as string] || System.Unknown;
}

function DetectSystemBrowser(ua?: string) {
    ua = ua || window?.navigator?.userAgent || '';
    if(/Windows/i.test(ua) || /Win\d+/i.test(ua)) {
        return System.Windows;
    }
    if(/Linux/i.test(ua) || /X11/i.test(ua)) {
        return System.Linux;
    }
    if(/Mac\s*OS/i.test(ua)) {
        return System.MacOS;
    }
    return System.Unknown;
}