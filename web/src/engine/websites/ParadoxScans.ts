import { Tags } from '../Tags';
import icon from './ParadoxScans.webp';
import { InitManga } from './templates/InitManga';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/seri\/[^/]+\/$/, 'ul.uk-breadcrumb li:last-of-type')
@Common.MangasMultiPageCSS('div.manga-block div.uk-grid-small a.uk-link-heading', Common.PatternLinkGenerator('/seri/page/{page}/'))
export default class extends InitManga {
    public constructor() {
        super('paradoxscans', 'Paradox Scans', 'https://paradoxscans.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}