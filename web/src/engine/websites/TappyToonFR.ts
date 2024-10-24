import { Tags } from '../Tags';
import icon from './TappyToon.webp';
import Tappytoon from './TappyToon';

export default class extends Tappytoon {

    public constructor() {
        super('tappytoon-fr', 'TappyToon (FR)', 'https://www.tappytoon.com', [Tags.Media.Manhwa, Tags.Language.French, Tags.Source.Official]);
        this.language = 'fr';
    }

    public override get Icon() {
        return icon;
    }
}