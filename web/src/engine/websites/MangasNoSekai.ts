import { Tags } from '../Tags';
import icon from './MangasNoSekai.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';
import { RateLimit } from '../taskpool/RateLimit';

type APIChapters = {
    chapters_to_display: {
        link: string,
        name: string
    }[]
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'p.titleMangaSingle')
@Common.MangasMultiPageCSS('/biblioteca/page/{page}/', 'div.page-listing-item figure > a', 1, 1, 0, Common.AnchorInfoExtractor(true))
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangasnosekai', 'Mangas No Sekai', 'https://mangasnosekai.com', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Scanlator);
        this.imageTaskPool.RateLimit = new RateLimit(4, 1);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaId = (await FetchCSS<HTMLInputElement>(new Request(new URL(manga.Identifier, this.URI)), 'input.rating-post-id')).at(0).value.trim();
        const chapterList = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, mangaId, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList.distinct();
    }

    private async GetChaptersFromPage(manga: Manga, mangaId: string, page: number): Promise<Chapter[]> {
        const { chapters_to_display } = await FetchJSON<APIChapters>(new Request(new URL('./wp-json/muslitos/v1/getcaps7', this.URI), {
            method: 'POST',
            body: new URLSearchParams({
                action: 'muslitos_anti_hack',
                page: page.toString(),
                mangaid: mangaId,
                secret: 'mihonsuckmydick'
            }).toString(),
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                Origin: this.URI.origin,
                Referer: new URL(manga.Identifier, this.URI).href,
                'X-Requested-With':	'XMLHttpRequest'
            }
        }));
        return chapters_to_display.map(({ link, name }) => new Chapter(this, manga, new URL(link, this.URI).pathname, name));
    }
}