import { Tags } from '../Tags';
import icon from './Boomtoon.webp';
import { DelitoonBase } from './templates/DelitoonBase';

export default class extends DelitoonBase {
    public constructor() {
        super('boomtoon', `Boomtoon`, 'https://www.boomtoon.com', Tags.Language.Thai, Tags.Media.Manhwa, Tags.Source.Official);
        this.balconyID = 'BOOMTOON_COM';
        this.mangaSearchVersion = 2;
    }

    public override get Icon() {
        return icon;
    }
}