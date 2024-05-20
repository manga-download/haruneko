// This file contans all channel definitions used by app(s) and web

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