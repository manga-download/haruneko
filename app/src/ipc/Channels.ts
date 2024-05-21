// This file contains all channel definitions used by app(s) and web

/**
 * Supported IPC Channels for interacting with the main application window.
 */
export namespace ApplicationWindow {

    /**
     * Send from the Main process and received in the Render process.
     */
    export type Web = never;

    /**
     * Send from the Render process and received in the Main process.
     */
    export enum App {
        ShowWindow = 'ApplicationWindow::ShowWindow()',
        HideWindow = 'ApplicationWindow::HideWindow()',
        Minimize = 'ApplicationWindow::Minimize()',
        Maximize = 'ApplicationWindow::Maximize()',
        Restore = 'ApplicationWindow::Restore()',
        Close = 'ApplicationWindow::Close()',
        OpenSplash = 'ApplicationWindow::OpenSplash(url: string)',
        CloseSplash = 'ApplicationWindow::CloseSplash()',
    };
}

/**
 * ...
 */
export namespace FetchProvider {

    /**
     * Send from the Main process and received/processsed in the Render process.
     */
    export type Web = never;

    /**
     * Send from the Render process and received/processsed in the Main process.
     */
    export enum App {
        Initialize = 'FetchProvider::Initialize(fetchApiSupportedPrefix: string)',
    };
}

/**
 * Supported IPC Channels for interacting with browser windows.
 */
export namespace RemoteBrowserWindowController {

    /**
     * Send from the Main process and received in the Render process.
     */
    export enum Web {
        OnDomReady = 'Browser::OnDomReady(windowID: number)',
        OnBeforeNavigate = 'Browser::OnBeforeNavigate(windowID: number)',
    };

    /**
     * Send from the Render process and received in the Main process.
     */
    export enum App {
        OpenWindow = 'Browser::OpenWindow(options: string)',
        CloseWindow = 'Browser::CloseWindow(windowID: number)',
        SetVisibility = 'Browser::SetVisibility(windowID: number, show: boolean)',
        ExecuteScript = 'Browser::ExecuteScript(windowID: number, script: string)',
        LoadURL = 'Browser::LoadURL(windowID: number, url: string, options: string)',
    };
}

/**
 * Supported IPC Channels for interacting with the RPC manager.
 */
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
        Stop = 'RemoteProcedureCallManager::Stop()',
        Restart = 'RemoteProcedureCallManager::Restart(port: number, secret: string)',
    };
}

/**
 * Supported IPC Channels for interacting with the RPC contract callbacks.
 */
export namespace RemoteProcedureCallContract {

    /**
     * Send from the Main process and received/processed in the Render process.
     * Send from the Background script and received/processed in the Content script.
     */
    export const enum Web {
        LoadMediaContainerFromURL = 'RemoteProcedureCallContract::LoadMediaContainerFromURL(url: string)',
    };

    /**
     * Send from the Render process and received/processed in the Main process.
     * Send from the Content script and received/procesed in the Background script.
     */
    export type App = never;
}