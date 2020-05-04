import { IPlayground, Playground } from './Playground';

export interface IHakuNeko {
    Playground: IPlayground;
}

export class HakuNeko implements IHakuNeko {

    private playground: IPlayground;

    public get Playground() {
        this.playground = this.playground || new Playground();
        return this.playground;
    }
}