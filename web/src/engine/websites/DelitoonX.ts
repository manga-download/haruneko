import { Tags } from '../Tags';
import icon from './DelitoonX.webp';
import { DelitoonBase } from './templates/DelitoonBase';

export default class extends DelitoonBase {
    public constructor() {
        super('delitoonx', `DelitoonX`, 'https://www.delitoonx.com', Tags.Language.French, Tags.Media.Manhwa, Tags.Rating.Pornographic, Tags.Source.Official);
        this.BalconyID = 'DELITOONX_COM';
    }

    public override get Icon() {
        return icon;
    }
}