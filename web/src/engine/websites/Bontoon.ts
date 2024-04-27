import { Tags } from '../Tags';
import icon from './Bontoon.webp';
import Delitoon from './Delitoon';
export default class extends Delitoon {
    public constructor() {
        super('bontoon', `Bontoon`, 'https://www.bontoon.com', 'BONTOON_COM', [Tags.Language.French, Tags.Media.Manhwa, Tags.Rating.Pornographic, Tags.Source.Official]);
    }
    public override get Icon() {
        return icon;
    }
}