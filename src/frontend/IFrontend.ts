export interface IFrontendInfo {
    ID: string;
    Label: string;
    Description: string;
    Screenshot: string;
    ModuleFile: string;
}

export interface IFrontendModule {
    Render: (root: Element) => Promise<void>;
}