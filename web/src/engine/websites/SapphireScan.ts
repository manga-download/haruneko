import { Tags } from '../Tags';
import icon from './SapphireScan.webp';
import * as Common from './decorators/Common';
import { PageLinkExtractor, ZeistManga } from './templates/ZeistManga';

@Common.MangaCSS<HTMLImageElement>(/^{origin}\/\d+\/\d+\/[^/]+\.html$/, 'figure a img', (img, uri) => ({ id: uri.pathname, title: img.alt.trim() }))
@Common.PagesSinglePageCSS('div.check-box div.separator a img', PageLinkExtractor)
export default class extends ZeistManga {
    public constructor() {
        super('sapphirescan', 'Sapphire Scan', 'https://www.sapphirescan.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}