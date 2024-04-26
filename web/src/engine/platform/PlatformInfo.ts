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

export class PlatformInfo {
    public readonly OS: System;
    public readonly Runtime: Runtime;

    constructor() {
        this.OS = System.Unknown;
        this.Runtime = Runtime.Unknown;
        const ua = window?.navigator?.userAgent ?? '';

        if(typeof globalThis?.Deno === 'object') {
            this.OS = this.DetectSystemDeno();
            this.Runtime = Runtime.Deno;
            return;
        }

        if(typeof globalThis?.process === 'object') {
            if(typeof globalThis?.nw?.Window === 'object') {
                this.OS = this.DetectSystemBrowser(ua);
                this.Runtime = Runtime.NodeWebkit;
                return;
            } else {
                this.OS = this.DetectSystemNode();
                this.Runtime = Runtime.Node;
                return;
            }
        }

        if(globalThis?.ipcRenderer) {
            this.OS = this.DetectSystemBrowser(ua);
            this.Runtime = Runtime.Electron;
            return;
        }

        if(/Chrome\/\d+/.test(ua)) {
            this.OS = this.DetectSystemBrowser(ua);
            this.Runtime = Runtime.Chrome;
            return;
        }

        if(/Gecko\/\d+/.test(ua)) {
            this.OS = this.DetectSystemBrowser(ua);
            this.Runtime = Runtime.Gecko;
            return;
        }

        if(/Safari\/\d+/.test(ua)) {
            this.OS = this.DetectSystemBrowser(ua);
            this.Runtime = Runtime.WebKit;
            return;
        }
    }

    // https://doc.deno.land/deno/stable/~/Deno.build
    private DetectSystemDeno() {
        return {
            'windows': System.Windows,
            'darwin': System.MacOS,
            'linux': System.Linux,
        }[globalThis?.Deno?.build?.os as string] || System.Unknown;
    }

    // https://nodejs.org/api/process.html#process_process_platform
    private DetectSystemNode(): System {
        return {
            'win32': System.Windows,
            'darwin': System.MacOS,
            'linux': System.Linux,
        }[globalThis?.process?.platform as string] || System.Unknown;
    }

    private DetectSystemBrowser(ua: string) {
        ua = ua ?? '';
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
}