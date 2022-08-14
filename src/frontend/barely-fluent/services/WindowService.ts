import { DI } from '@microsoft/fast-foundation';
import { observable } from '@microsoft/fast-element';

export const IWindowService = DI.createInterface<IWindowService>(builder => builder.singleton(WindowService));

export interface IWindowService {
    Minimize(): void;
    Maximize(): void;
    Restore(): void;
    Close(): void;
}

export class WindowService implements IWindowService {

    constructor() {
        //this.Maximized = false;
    }

    @observable Maximized = false;

    public Minimize(): void {
        //throw new Error('Method not implemented.');
    }

    public Maximize(): void {
        //throw new Error('Method not implemented.');
    }

    public Restore(): void {
        //throw new Error('Method not implemented.');
    }

    public Close(): void {
        //throw new Error('Method not implemented.');
    }
}