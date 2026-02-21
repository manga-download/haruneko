import { Tags } from '../Tags';
import icon from './TempleScanEsp.webp';
import * as Common from './decorators/Common';
import { Kosaku } from './templates/Kosaku';

@Common.PagesSinglePageJS('[...document.querySelectorAll("div.page-break img")].map(img => img.src);', 4500)
export default class extends Kosaku {

    public constructor() {
        super('templescanesp', 'Temple Scan (ESP)', 'https://aedexnox.pwhost.xyz', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}