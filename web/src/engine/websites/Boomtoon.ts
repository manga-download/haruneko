import { Tags } from '../Tags';
import icon from './BoomToon.webp';
import Delitoon from './Delitoon';
export default class extends Delitoon {
    public constructor() {
        super('boomtoon', `Boomtoon`, 'https://www.boomtoon.com', 'BOOMTOON_COM', [Tags.Language.Thai, Tags.Media.Manhwa, Tags.Source.Official]);
    }
    public override get Icon() {
        return icon;
    }
}