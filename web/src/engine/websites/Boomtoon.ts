import { Tags } from '../Tags';
import icon from './BoomToon.webp';
import { DelitoonBase } from './templates/DelitoonBase';

export default class extends DelitoonBase {
    public constructor() {
        super('boomtoon', `Boomtoon`, 'https://www.boomtoon.com', Tags.Language.Thai, Tags.Media.Manhwa, Tags.Source.Official);
        this.BalconyID = 'BOOMTOON_COM';
    }

    public override get Icon() {
        return icon;
    }
}