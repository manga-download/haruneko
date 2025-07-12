import { Tags } from '../Tags';
import icon from './DatgarScan.webp';
import { PageLinkExtractor, ZeistManga } from './templates/ZeistManga';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/\d+\/\d+\/[^/]+\.html$/, 'meta[name="description"]')
@Common.PagesSinglePageCSS('div.check-box div.separator a img', PageLinkExtractor)
export default class extends ZeistManga {
    public constructor() {
        super('datgarscan', 'Datgar Scan', 'https://datgarscanlation.blogspot.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Scanlator);
        this.mangaSlugScript = 'label;';
    }

    public override get Icon() {
        return icon;
    }
}