import { Tags } from '../Tags';
import icon from './CoolMic.webp';
import CoolMic from './CoolMic';
export default class extends CoolMic {

    public constructor() {
        super('coolmicfr', 'CoolMic (French)', 'https://fr.coolmic.me', [Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.French, Tags.Source.Official]);
    }
    public override get Icon() {
        return icon;
    }

}