import { ipcMain } from 'electron';
//import type * as Channels from '../../../src/ipc/Channels';

// This file contains all channel definitions used by app(s) and web

export namespace Channels {

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
        export enum AppToWeb {
            /** Channel for IPC callback with signature: `(details: Electron.OnBeforeSendHeadersListenerDetails) => Promise<Electron.BeforeSendResponse>` */
            OnBeforeSendHeaders = 'FetchProvider::OnBeforeSendHeaders',
            /** Channel for IPC callback with signature: `(details: Electron.OnBeforeSendHeadersListenerDetails) => Promise<Electron.BeforeSendResponse>` */
            OnHeadersReceived = 'FetchProvider::OnHeadersReceived',
        }

        /** Send from the Render process and received/processsed in the Main process. */
        export enum WebToApp {
            /** Channel for IPC callback with signature: `(fetchApiSupportedPrefix: string) => Promise<void>` */
            Initialize = 'FetchProvider::Initialize',
            /** Channel for IPC callback with signature: `(filter: Electron.CookiesGetFilter) => Promise<Electron.Cookie[]>` */
            GetSessionCookies = 'FetchProvider::GetSessionCookies'
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
            /** Channel for IPC callback with signature: `<T extends JSONElement>(windowID: number, script: string) => Promise<T>` */
            ExecuteScript = 'RemoteBrowserWindowController::ExecuteScript',
            /** Channel for IPC callback with signature: `<T extends void | JSONElement>(windowID: number, method: string, parameters?: JSONObject) => Promise<T>` */
            SendDebugCommand = 'RemoteBrowserWindowController::SendDebugCommand',
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
        export type Web = never;

        /**
         * Send from the Render process and received/processed in the Main process.
         * Send from the Content script and received/procesed in the Background script.
         */
        export const enum App {
            /** Channel for IPC callback with signature: `(patterns: string[]) => Promise<void>` */
            Initialize = 'BloatGuard::Initialize',
        }
    }
}

export class IPC {

    constructor(private readonly webContents: Electron.WebContents) {}

    // TODO: Signature declarations for `Send`
    Send(method: Channels.FetchProvider.Web.OnBeforeSendHeaders, url: string, requestHeaders: Electron.OnBeforeSendHeadersListenerDetails[ 'requestHeaders' ]): void;

    public Send(method: string, ...parameters: JSONArray): void {
        this.webContents.send(method, ...parameters);
    }

    // TODO: Signature declarations for `Listen`

    Listen(method: Channels.ApplicationWindow.App.ShowWindow, callback: () => Promise<void>): void;
    Listen(method: Channels.ApplicationWindow.App.HideWindow, callback: () => Promise<void>): void;
    Listen(method: Channels.ApplicationWindow.App.Minimize, callback: () => Promise<void>): void;
    Listen(method: Channels.ApplicationWindow.App.Maximize, callback: () => Promise<void>): void;
    Listen(method: Channels.ApplicationWindow.App.Restore, callback: () => Promise<void>): void;
    Listen(method: Channels.ApplicationWindow.App.Close, callback: () => Promise<void>): void;
    Listen(method: Channels.ApplicationWindow.App.OpenSplash, callback: () => Promise<void>): void;
    Listen(method: Channels.ApplicationWindow.App.CloseSplash, callback: () => Promise<void>): void;

    Listen(method: Channels.BloatGuard.App.Initialize, callback: (patterns: string[]) => Promise<void>): void;

    Listen(method: Channels.FetchProvider.App.Initialize, callback: (fetchApiSupportedPrefix: string) => Promise<void>): void;
    Listen(method: Channels.FetchProvider.App.GetSessionCookies, callback: (filter: Electron.CookiesGetFilter) => PromiseLike<Electron.Cookie[]>): void;

    public Listen<TParameters extends JSONArray, TReturn extends void | JSONElement>(method: string, callback: (...parameters: TParameters) => PromiseLike<TReturn>): void {
        ipcMain.handle(method, (_, ...parameters: TParameters) => callback(...parameters));
    }
}