import { DI } from '@microsoft/fast-foundation';
import { observable } from '@microsoft/fast-element';
import { Registration } from '@microsoft/fast-foundation';
import type { IWindowController } from '../../WindowController';

export const IWindowService = DI.createInterface<IWindowService>();

export interface IWindowService {
    readonly IsMaximized: boolean;
    Minimize(): void;
    Maximize(): void;
    Restore(): void;
    Close(): void;
}

class WindowService implements IWindowService {

    constructor(private readonly windowController: IWindowController) {
    }

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

export function createWindowService(windowController: IWindowController) {
    return Registration.instance(IWindowService, new WindowService(windowController));
}