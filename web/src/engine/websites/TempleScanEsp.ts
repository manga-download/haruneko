import { Tags } from '../Tags';
import icon from './TempleScanEsp.webp';
import { Kozaku } from './templates/Kozaku';

export default class extends Kozaku {

    public constructor() {
        super('templescanesp', 'Temple Scan (ESP)', 'https://templescanesp.caserosvive.com.ar', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

}