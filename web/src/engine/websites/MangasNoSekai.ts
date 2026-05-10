import { Tags } from '../Tags';
import icon from './MangasNoSekai.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchHTML, FetchJSON } from '../platform/FetchProvider';
import { RateLimit } from '../taskpool/RateLimit';

type APIChapters = {
    chapters_to_display: {
        link: string;
        name: string;
        name_extend: string;
    }[];
};

type ChaptersData = {
    firstChapters: Chapter[];
    mangaId: string;
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'p.titleMangaSingle')
@Common.MangasMultiPageCSS('div.page-listing-item figure > a', Common.PatternLinkGenerator('/biblioteca/page/{page}/'), 0, Common.AnchorInfoExtractor(true))
@Madara.PagesSinglePageCSS()
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor(id = 'mangasnosekai', label = 'Mangas No Sekai', url = 'https://mangasnosekai.com', tags = [Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Scanlator]) {
        super(id, label, url, ...tags);
        this.imageTaskPool.RateLimit = new RateLimit(4, 1);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { firstChapters, mangaId } = await this.GetFirstChaptersAndMangaID(manga);
        const ApiChapters = await this.GetChaptersFromAPI(manga, mangaId);
        return [...firstChapters, ...ApiChapters];
    }

    protected async GetChaptersFromAPI(manga: Manga, mangaId: string): Promise<Chapter[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            try {
                //start with second page
                for (let page = 2, run = true; run; page++) {
                    const { chapters_to_display } = await FetchJSON<APIChapters>(new Request(new URL('./wp-json/muslitos/v1/getcaps7', this.URI), {
                        method: 'POST',
                        body: new URLSearchParams({
                            action: 'muslitos_anti_hack',
                            page: `${page}`,
                            mangaid: mangaId,
                            secret: 'mihonsuckmydick'
                        }).toString(),
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        }
                    }));
                    const chapters = chapters_to_display.map(({ link, name, name_extend: subtitle }) => new Chapter(this, manga, new URL(link, this.URI).pathname, [name, subtitle].filter(Boolean).join(' ').replace(/\s{2}/, ' ').trim()));
                    chapters.length > 0 ? yield* chapters : run = false;
                }
            } catch { }
        }.call(this));
    }

    private async GetFirstChaptersAndMangaID(manga: Manga): Promise<ChaptersData> {
        //Always get first page using CSS (so we got a few chapters if not logged)
        const doc = await FetchHTML(new Request(new URL(manga.Identifier, this.URI)));
        const mangaId = new URL(doc.querySelector<HTMLLinkElement>('link[rel="shortlink"]').href).searchParams.get('p');
        const firstChapters = [...doc.querySelectorAll<HTMLAnchorElement>('.container-capitulos .grid-capitulos a.group')].map(anchor => {
            return new Chapter(this, manga, anchor.pathname, [
                anchor.querySelector('div.text-sm')?.textContent.trim(),
                anchor.querySelector('div.d-md-block')?.textContent.trim()
            ].join(' ').trim());

        }).filter(chapter => chapter.Title);
        return { firstChapters, mangaId };
    }
}