import { Tags } from '../Tags';
import icon from './HijalaScans.webp';
import * as Common from './decorators/Common';
import { VTheme, pageScript } from './templates/VTheme';

@Common.PagesSinglePageJS(pageScript, 750, true)
export default class extends VTheme {

    public constructor() {
        super('hijalascans', 'Hijala Scans', 'https://en-hijala.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}