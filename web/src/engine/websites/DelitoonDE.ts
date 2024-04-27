import { Tags } from '../Tags';
import icon from './DelitoonDE.webp';
import Delitoon from './Delitoon';
export default class extends Delitoon {
    public constructor() {
        super('delitoonde', `Delitoon (German)`, 'https://www.delitoon.de', 'DELITOON_DE', [Tags.Language.German, Tags.Media.Manhwa, Tags.Source.Official]);
    }
    public override get Icon() {
        return icon;
    }
}