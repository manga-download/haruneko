import { Tags } from '../Tags';
import icon from './MangaPill.webp';
import { DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/\d+\/[^/]+$/, 'div.container h1')
@Common.ChaptersSinglePageCSS('div#chapters div a')
@Common.PagesSinglePageCSS('img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangapill', 'MangaPill', 'https://mangapill.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (const letter of 'aeiouy'.split('')) {
            const mangas = await Common.FetchMangasMultiPageCSS.call(this, provider, 'div.container div.grid a:has(figure)', Common.PatternLinkGenerator(`/search?q=${letter}&page={page}`), 0, anchor => ({
                id: (anchor as HTMLAnchorElement).pathname,
                title: anchor.querySelector<HTMLImageElement>('figure img').alt.trim()
            }));
            mangaList.push(...mangas);
        }
        return mangaList.distinct();
    }

}