import { Tags } from '../Tags';
import icon from './DelitoonDE.webp';
import { DelitoonBase } from './templates/DelitoonBase';

export default class extends DelitoonBase {
    public constructor() {
        super('delitoonde', `Delitoon (German)`, 'https://www.delitoon.de', Tags.Language.German, Tags.Media.Manhwa, Tags.Source.Official);
        this.BalconyID = 'DELITOON_DE';
    }

    public override get Icon() {
        return icon;
    }
}