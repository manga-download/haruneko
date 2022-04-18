import type { IWindowController } from './WindowController';

export interface IFrontendInfo {
    ID: string;
    Label: string;
    Description: string;
    Screenshots: string[];
    LoadModule(): Promise<IFrontendModule>;
}

export interface IFrontendModule {
    Render(root: HTMLElement, windowController: IWindowController): Promise<void>;
}