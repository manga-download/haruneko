import { Tags } from '../Tags';
import icon from './OrckuMangas.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/ficha\?id=\d+$/, 'div.card h1.font-bold', Common.WebsiteInfoExtractor({ includeSearch: true }))
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.grid div.card a', Common.PatternLinkGenerator('/biblioteca?page={page}'), 0, anchor => ({
    id: anchor.pathname + anchor.search,
    title: anchor.querySelector('h3').textContent.trim()
}))
@Common.ChaptersMultiPageCSS<HTMLAnchorElement>('div.cap-grid a.cap-card', Common.PatternLinkGenerator('{id}&page={page}&order=desc'), 0, anchor => ({
    id: anchor.pathname + anchor.search,
    title: anchor.querySelector('div.cap-num').textContent.trim()
}))
@Common.PagesSinglePageCSS('div#chapterImages img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('orckumangas', 'OrckuMangas', 'https://orckumangas.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `cookieStore.set('orcku_mayor_edad', '1')`);
    }
}