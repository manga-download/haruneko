import type { IAppWindow } from '../engine/platform/AppWindow';
import type { IResource } from '../i18n/ILocale';

export interface IFrontendInfo {
    ID: string;
    Label: keyof IResource;
    Description: keyof IResource;
    Screenshots: string[];
    LoadModule(): Promise<IFrontendModule>;
}

export interface IFrontendModule {
    Render(root: HTMLElement, windowController: IAppWindow): Promise<void>;
}