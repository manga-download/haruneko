import { Tags } from '../Tags';
import icon from './XoxoComics.webp';
import { DecoratableMangaScraper, type MangaPlugin, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function MangaLinkExtractor(head: HTMLHeadingElement, uri: URL) {
    return {
        id: uri.pathname,
        title: head.innerText.replace(/ Comic/i, '').trim(),
    };
}

@Common.MangaCSS(/^{origin}\/comic\/[^/]+$/, 'article#item-detail > h1.title-detail', MangaLinkExtractor)
@Common.ChaptersMultiPageCSS<HTMLAnchorElement>('div.chapter > a', Common.PatternLinkGenerator('{id}?page={page}'), 0, anchor => ({ id: anchor.pathname + '/all', title: anchor.text }))
@Common.PagesSinglePageCSS('div.page-chapter img', img => img.dataset.original)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('xoxocomics', `XoxoComics`, 'https://xoxocomic.com', Tags.Language.English, Tags.Media.Comic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (const letter of '0abcdefghijklmnopqrstuvwxyz'.split('')) {
            const mangas = await Common.FetchMangasMultiPageCSS.call(this, provider, 'div.chapter a', Common.PatternLinkGenerator(`/comic-list?c=${letter}&page={page}`));
            mangaList.push(...mangas);
        }
        return mangaList.distinct();
    }
}