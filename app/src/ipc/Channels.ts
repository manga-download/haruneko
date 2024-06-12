// This file contains all channel definitions used by app(s) and web

/** Supported IPC Channels for interacting with the main application window. */
export namespace ApplicationWindow {

    /** Send from the Main process and received in the Render process. */
    export type Web = never;

    /** Send from the Render process and received in the Main process. */
    export enum App {
        /** Channel for IPC callback with signature: `() => Promise<void>` */
        ShowWindow = 'ApplicationWindow::ShowWindow',
        /** Channel for IPC callback with signature: `() => Promise<void>` */
        HideWindow = 'ApplicationWindow::HideWindow',
        /** Channel for IPC callback with signature: `() => Promise<void>` */
        Minimize = 'ApplicationWindow::Minimize',
        /** Channel for IPC callback with signature: `() => Promise<void>` */
        Maximize = 'ApplicationWindow::Maximize',
        /** Channel for IPC callback with signature: `() => Promise<void>` */
        Restore = 'ApplicationWindow::Restore',
        /** Channel for IPC callback with signature: `() => Promise<void>` */
        Close = 'ApplicationWindow::Close',
        /** Channel for IPC callback with signature: `(url: string) => Promise<void>` */
        OpenSplash = 'ApplicationWindow::OpenSplash',
        /** Channel for IPC callback with signature: `() => Promise<void>` */
        CloseSplash = 'ApplicationWindow::CloseSplash',
    };
}

/** Supported IPC Channels for interacting with the fetch provider. */
export namespace FetchProvider {

    /** Send from the Main process and received/processsed in the Render process. */
    export type Web = never;

    /** Send from the Render process and received/processsed in the Main process. */
    export enum App {
        /** Channel for IPC callback with signature: `(fetchApiSupportedPrefix: string) => Promise<void>` */
        Initialize = 'FetchProvider::Initialize',
    };
}

/** Supported IPC Channels for interacting with browser windows. */
export namespace RemoteBrowserWindowController {

    /** Send from the Main process and received in the Render process. */
    export enum Web {
        /** Channel for IPC callback with signature: `(windowID: number) => Promise<void>` */
        OnDomReady = 'RemoteBrowserWindowController::OnDomReady',
        /** Channel for IPC callback with signature: `(windowID: number, url: string, isMainFrame: boolean, isSameDocument: boolean) => Promise<void>` */
        OnBeforeNavigate = 'RemoteBrowserWindowController::OnBeforeNavigate',
    };

    /** Send from the Render process and received in the Main process. */
    export enum App {
        /** Channel for IPC callback with signature: `(options: string) => Promise<number>` */
        OpenWindow = 'RemoteBrowserWindowController::OpenWindow',
        /** Channel for IPC callback with signature: `(windowID: number) => Promise<void>` */
        CloseWindow = 'RemoteBrowserWindowController::CloseWindow',
        /** Channel for IPC callback with signature: `(windowID: number, show: boolean) => Promise<void>` */
        SetVisibility = 'RemoteBrowserWindowController::SetVisibility',
        /** Channel for IPC callback with signature: `(windowID: number, script: string) => Promise<T>` */
        ExecuteScript = 'RemoteBrowserWindowController::ExecuteScript',
        /** Channel for IPC callback with signature: `(windowID: number, url: string, options: string) => Promise<void>` */
        LoadURL = 'RemoteBrowserWindowController::LoadURL',
    };
}

/** Supported IPC Channels for interacting with the RPC manager. */
export namespace RemoteProcedureCallManager {

    /**
     * Send from the Main process and received/processed in the Render process.
     * Send from the Background script and received/processsed in the Content script.
     */
    export type Web = never;

    /**
     * Send from the Render process and received/processed in the Main process.
     * Send from the Content script and received/processed in the Background script.
     */
    export const enum App {
        /** Channel for IPC callback with signature: `() => Promise<void>` */
        Stop = 'RemoteProcedureCallManager::Stop',
        /** Channel for IPC callback with signature: `(port: number, secret: string) => Promise<void>` */
        Restart = 'RemoteProcedureCallManager::Restart',
    };
}

/** Supported IPC Channels for interacting with the RPC contract callbacks. */
export namespace RemoteProcedureCallContract {

    /**
     * Send from the Main process and received/processed in the Render process.
     * Send from the Background script and received/processed in the Content script.
     */
    export const enum Web {
        /** Channel for IPC callback with signature: `(url: string) => Promise<void>` */
        LoadMediaContainerFromURL = 'RemoteProcedureCallContract::LoadMediaContainerFromURL',
    };

    /**
     * Send from the Render process and received/processed in the Main process.
     * Send from the Content script and received/procesed in the Background script.
     */
    export type App = never;
}

export namespace BloatGuard {

    /**
     * Send from the Main process and received/processed in the Render process.
     * Send from the Background script and received/processed in the Content script.
     */
    export type  Web = never;

    /**
     * Send from the Render process and received/processed in the Main process.
     * Send from the Content script and received/procesed in the Background script.
     */
    export const enum App {
        /** Channel for IPC callback with signature: `(patterns: string[]) => Promise<void>` */
        Initialize = 'BloadGuard::Initialize',
    }
}