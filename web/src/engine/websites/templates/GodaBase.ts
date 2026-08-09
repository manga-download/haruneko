import { FetchCSS, FetchJSON } from '../../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, type Manga } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';

type APIChapters = {
    data: {
        chapters: {
            id: string;
            attributes: {
                title: string;
                slug: string;
                order: number;
            };
        }[];
    };
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'nav ol li:last-of-type a')
@Common.MangasMultiPageCSS('div.cardlist a', Common.PatternLinkGenerator('/manga/page/{page}'), 500)
@Common.PagesSinglePageJS(`[ ...document.querySelectorAll('div#chapcontent img') ].map(img => img.dataset.src || img.src);`, 1500)
@Common.ImageAjax()
export class GodaBase extends DecoratableMangaScraper {
    protected apiURL = this.URI;

    public WithApiURL(url: URL) {
        this.apiURL = url;
        return this;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaId = (await FetchCSS(new Request(new URL(manga.Identifier, this.URI)), '#mangachapters')).at(0).dataset.mid;
        const { data: { chapters } } = await FetchJSON<APIChapters>(new Request(new URL(`./manga/get?mid=${mangaId}&mode=all`, this.apiURL)));
        return chapters.map(({ attributes: { title, slug } }) => new Chapter(this, manga, `${manga.Identifier}/${slug}`, title.replace(manga.Title, '').trim() || title.trim()));
    }

}