import { DI } from '@microsoft/fast-element/di.js';
import { observable } from '@microsoft/fast-element';
import type { IAppWindow } from '../../../engine/platform/AppWindow';

export class WindowManager {

    constructor(private readonly windowController: IAppWindow) {
        this.windowController.Maximized.Subscribe(value => this.IsMaximized = value);
    }

    @observable IsMaximized = false;

    public Minimize(): void {
        this.windowController.Minimize();
    }

    public Maximize(): void {
        this.windowController.Maximize();
    }

    public Restore(): void {
        this.windowController.Restore();
    }

    public Close(): void {
        this.windowController.Close();
    }
}

export type { WindowManager as IWindowManager };
export const WindowManagerRegistration = DI.createContext<WindowManager>();