import { Tags } from '../Tags';
import icon from './DelitoonDE.webp';
import Delitoon from './Delitoon';
export default class extends Delitoon {
    public constructor() {
        super('delitoonde', `Delitoon (German)`, 'https://www.delitoon.de', [Tags.Language.German, Tags.Media.Manhwa, Tags.Source.Official]);
        this.BalconyID = 'DELITOON_DE';
    }
    public override get Icon() {
        return icon;
    }
}