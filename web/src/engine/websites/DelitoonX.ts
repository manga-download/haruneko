import { Tags } from '../Tags';
import icon from './DelitoonX.webp';
import Delitoon from './Delitoon';
export default class extends Delitoon {
    public constructor() {
        super('delitoonx', `DelitoonX`, 'https://www.delitoonx.com', 'DELITOONX_COM', [Tags.Language.French, Tags.Media.Manhwa, Tags.Rating.Pornographic, Tags.Source.Official]);
    }
    public override get Icon() {
        return icon;
    }
}