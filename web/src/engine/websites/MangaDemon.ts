import { Tags } from '../Tags';
import icon from './MangaDemon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div#manga-info-rightColumn h1.big-fat-titles')
@Common.MangasMultiPageCSS('div.updates-element-info > h2 a', Common.PatternLinkGenerator('/newmangalist.php?list={page}'), 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('div#chapters-list a', undefined, anchor => ({
    id: anchor.pathname + anchor.search,
    title: anchor.title.trim()
}))
@Common.PagesSinglePageCSS('img.imgholder')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangademon', 'MangaDemon', 'https://demonicscans.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}