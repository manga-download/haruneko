export namespace Channels {

    /**
     * Supported IPC Channels for interacting with the main application window.
     */
    export enum ApplicationWindow {
        ShowWindow = 'ApplicationWindow::ShowWindow',
        HideWindow = 'ApplicationWindow::HideWindow',
        Minimize = 'ApplicationWindow::Minimize',
        Maximize = 'ApplicationWindow::Maximize',
        Restore = 'ApplicationWindow::Restore',
        Close = 'ApplicationWindow::Close',
        OpenSplash = 'ApplicationWindow::OpenSplash',
        CloseSplash = 'ApplicationWindow::CloseSplash',
    };

    /**
     * Supported IPC Channels for managing the blocked requests.
     */
    export enum BloatGuard {
        Initialize = 'BloatGuard::Initialize',
    };

    /**
     * Supported IPC Channels for interacting with the fetch provider.
     */
    export enum FetchProvider {
        //OnBeforeSendHeaders = 'FetchProvider::OnBeforeSendHeaders',
        //OnHeadersReceived = 'FetchProvider::OnHeadersReceived',
        Initialize = 'FetchProvider::Initialize',
        GetSessionCookies = 'FetchProvider::GetSessionCookies',
    };

    /**
     * Supported IPC Channels for creating and interacting with browser windows.
     */
    export enum RemoteBrowserWindowController {
        OnDomReady = 'RemoteBrowserWindowController::OnDomReady',
        OnBeforeNavigate = 'RemoteBrowserWindowController::OnBeforeNavigate',
        OpenWindow = 'RemoteBrowserWindowController::OpenWindow',
        CloseWindow = 'RemoteBrowserWindowController::CloseWindow',
        SetVisibility = 'RemoteBrowserWindowController::SetVisibility',
        ExecuteScript = 'RemoteBrowserWindowController::ExecuteScript',
        SendDebugCommand = 'RemoteBrowserWindowController::SendDebugCommand',
        LoadURL = 'RemoteBrowserWindowController::LoadURL',
    };

    /**
     * Supported IPC Channels for managing the RPC service.
     */
    export enum RemoteProcedureCallManager {
        Stop = 'RemoteProcedureCallManager::Stop',
        Restart = 'RemoteProcedureCallManager::Restart',
    };

    /**
     * Supported IPC Channels for using the RPC service.
     */
    export enum RemoteProcedureCallContract {
        LoadMediaContainerFromURL = 'RemoteProcedureCallContract::LoadMediaContainerFromURL',
    };
}