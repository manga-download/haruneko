import { Tags } from '../Tags';
import icon from './LezhinES.webp';
import Delitoon from './Delitoon';
export default class extends Delitoon {
    public constructor() {
        super('lezhin-es', `Lezhin (Spanish)`, 'https://www.lezhin.es', [Tags.Language.Spanish, Tags.Media.Manhwa, Tags.Source.Official]);
        this.BalconyID = 'LEZHIN_ES';
    }
    public override get Icon() {
        return icon;
    }
}