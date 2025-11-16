import { Tags } from '../Tags';
import icon from './GodaComic.webp';
import { DecoratableMangaScraper, type Manga, type Chapter } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchChapters } from './GodaManhua';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'nav ol li:last-of-type a')
@Common.MangasMultiPageCSS('div.cardlist a', Common.PatternLinkGenerator('/manga/page/{page}'))
@Common.PagesSinglePageCSS('div#chapcontent img[data-src]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('godacomic', 'GodaComic', 'https://manhuascans.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return FetchChapters.call(this, manga, '/chapter/getcontent?');
    }
}