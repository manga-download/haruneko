import { DI, Registration } from '@microsoft/fast-element/di.js';
import { observable } from '@microsoft/fast-element';
import type { IAppWindow } from '../../../engine/platform/AppWindow';

export interface IWindowManager {
    readonly IsMaximized: boolean;
    Minimize(): void;
    Maximize(): void;
    Restore(): void;
    Close(): void;
}

class WindowManager implements IWindowManager {

    constructor(private readonly windowController: IAppWindow) {}

    @observable IsMaximized = false;

    public Minimize(): void {
        this.windowController.Minimize();
    }

    public Maximize(): void {
        this.IsMaximized = true; // TODO: Implement correct solution instead of quick and dirty hack to determine current state
        this.windowController.Maximize();
    }

    public Restore(): void {
        this.IsMaximized = false; // TODO: Implement correct solution instead of quick and dirty hack to determine current state
        this.windowController.Restore();
    }

    public Close(): void {
        this.windowController.Close();
    }
}

export const WindowManagerService = DI.createContext<IWindowManager>();

export function registerWindowManagerService(windowController: IAppWindow) {
    DI.getOrCreateDOMContainer(document.body).register(Registration.instance(WindowManagerService, new WindowManager(windowController)));
}