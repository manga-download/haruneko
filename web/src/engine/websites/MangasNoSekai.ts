import { Tags } from '../Tags';
import icon from './MangasNoSekai.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';
import { RateLimit } from '../taskpool/RateLimit';

type APIChapters = {
    chapters_to_display: {
        link: string;
        name: string;
        name_extend: string;
    }[];
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'p.titleMangaSingle')
@Common.MangasMultiPageCSS('div.page-listing-item figure > a', Common.PatternLinkGenerator('/biblioteca/page/{page}/'), 0, Common.AnchorInfoExtractor(true))
@Madara.PagesSinglePageCSS()
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {
    private chapterAction = 'muslitos_anti_hack';
    private chapterEndpoint = './wp-json/muslitos/v1/getcaps7';

    public constructor(id = 'mangasnosekai', label = 'Mangas No Sekai', url = 'https://mangasnosekai.com', tags = [Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Scanlator]) {
        super(id, label, url, ...tags);
        this.imageTaskPool.RateLimit = new RateLimit(4, 1);
    }

    public override get Icon() {
        return icon;
    }

    public WithChaptersAction(action: string) {
        this.chapterAction = action;
        return this;
    }

    public WithChapterEndpoint(endpoint: string) {
        this.chapterEndpoint = endpoint;
        return this;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        const mangaId = new URL((await FetchCSS<HTMLLinkElement>(new Request(new URL(manga.Identifier, this.URI)), 'link[rel="shortlink"]'))[0].href).searchParams.get('p');
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { chapters_to_display } = await FetchJSON<APIChapters>(new Request(new URL(this.chapterEndpoint, this.URI), {
                    method: 'POST',
                    body: new URLSearchParams({
                        action: this.chapterAction,
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
        }.call(this));
    }
}