import { Tags } from '../Tags';
import icon from './HolonoMetria.webp';
import { Chapter, DecoratableMangaScraper, type Page, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

const mangaEndpoints = ['/id', '/en', ''].map(endpoint => `${endpoint}/holonometria/manga/`);

function MangaInfoExtractor(li: HTMLLIElement) {
    const link = li.querySelector<HTMLAnchorElement>('a.manga__btn');
    const language = ExtractLanguage(new URL(link.href));
    return {
        id: link.pathname,
        title: [li.querySelector<HTMLParagraphElement>('p.manga__title').textContent.trim(), `[${language}]`].join(' ')
    };
}

function ExtractLanguage(url: URL): string {
    return url.pathname.split('/').at(1).replace('alt', 'jp');
}

@Common.MangaCSS(/^{origin}(\/[^/]+)?\/alt\/holonometria\/manga\/[^/]+\/ep0\/$/, 'a.alt-nav__met-sub-link.is-current', (el, uri) => ({ id: uri.pathname, title: [el.textContent.trim(), `[${ExtractLanguage(uri)}]`].join(' ') }))
@Common.MangasMultiPageCSS<HTMLLIElement>('li.manga__item', Common.StaticLinkGenerator(...mangaEndpoints), 0, MangaInfoExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('holonometria', 'HolonoMetria', 'https://holoearth.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Language.English, Tags.Language.Indonesian, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaTitle = manga.Title.split('[').slice(0, -1).join('[').trim();
        const chapters = await FetchCSS<HTMLAnchorElement>(new Request(new URL(manga.Identifier, this.URI)), 'li.manga-detail__list-item a.manga-detail__list-link');
        return chapters.map(chapter => {
            const title = chapter.querySelector<HTMLParagraphElement>('p.manga-detail__list-title').textContent.trim();
            return new Chapter(this, manga, chapter.pathname, title.replace(mangaTitle, '').trim());
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        return (await Common.FetchPagesSinglePageCSS.call(this, chapter, 'div.manga-detail__swiper-slide img')).reverse();
    }
}