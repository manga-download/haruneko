export interface IFrontendInfo {
    ID: string;
    Label: string;
    Description: string;
    Screenshots: string[];
    LoadModule(): Promise<IFrontendModule>;
}

export interface IFrontendModule {
    SetWindowMenu(): void;
    Render(root: HTMLElement): Promise<void>;
}