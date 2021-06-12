export interface IFrontendInfo {
    ID: string;
    Label: string;
    Description: string;
    Screenshots: string[];
    ModuleFile: string;
}

export interface IFrontendModule {
    SetWindowMenu(): void;
    Render(root: HTMLElement): Promise<void>;
}