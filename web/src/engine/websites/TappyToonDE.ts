import { Tags } from '../Tags';
import icon from './TappyToon.webp';
import Tappytoon from './TappyToon';

export default class extends Tappytoon {

    public constructor() {
        super('tappytoon-de', 'TappyToon (DE)', 'https://www.tappytoon.com', [Tags.Media.Manhwa, Tags.Language.German, Tags.Source.Official]);
        this.language = 'de';
    }

    public override get Icon() {
        return icon;
    }
}