import { Tags } from '../Tags';
import icon from './TempleScanEsp.webp';
import { Kosaku } from './templates/Kosaku';

export default class extends Kosaku {

    public constructor () {
        super('templescanesp', 'Temple Scan (ESP)', 'https://aedexnox.vxviral.xyz', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}