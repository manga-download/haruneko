import { Tags } from '../Tags';
import icon from './Bontoon.webp';
import { DelitoonBase } from './templates/DelitoonBase';

export default class extends DelitoonBase {
    public constructor() {
        super('bontoon', `Bontoon`, 'https://www.bontoon.com', Tags.Language.French, Tags.Media.Manhwa, Tags.Rating.Pornographic, Tags.Source.Official);
        this.BalconyID = 'BONTOON_COM';
    }

    public override get Icon() {
        return icon;
    }
}