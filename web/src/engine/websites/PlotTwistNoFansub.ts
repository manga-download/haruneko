import { Tags } from '../Tags';
import icon from './PlotTwistNoFansub.webp';
import MangasNoSekai from './MangasNoSekai';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import type { Manga } from '../providers/MangaPlugin';
import { Chapter } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIChapters = {
    nav_items: {
        link: string;
        name: string;
        name_extend: string;
    }[];
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'p.mn-title-block')
@Common.MangasMultiPageCSS('div.page-listing-item figure > a', Common.PatternLinkGenerator('/biblioteca3/page/{page}/'), 0, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageCSS('div.reading-content img[data-src]')
export default class extends MangasNoSekai {
    private token = '';

    public constructor() {
        super('plottwistnofansub', 'Plot Twist No Fansub', 'https://plotnofansub.com', [Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Scanlator]);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.token = await FetchWindowScript<string>(new Request(this.URI), 'window.mnSeriesNavBundle.navCsrf', 750);
    }

    protected override async GetChaptersFromAPI(manga: Manga, mangaId: string): Promise<Chapter[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            try {
                for (let page = 2, run = true; run; page++) {
                    const { nav_items } = await FetchJSON<APIChapters>(new Request(new URL('./wp-json/plot/v1/series-nav-batch', this.URI), {
                        method: 'POST',
                        body: new URLSearchParams({
                            page: `${page}`,
                            navCsrf: this.token,
                            seriesPost: mangaId
                        }).toString(),
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        }
                    }));
                    const chapters = nav_items.map(({ link, name, name_extend: subtitle }) => new Chapter(this, manga, new URL(link, this.URI).pathname, [name, subtitle].filter(Boolean).join(' ').replace(/\s{2}/, ' ').trim()));
                    chapters.length > 0 ? yield* chapters : run = false;
                }
            } catch { }
        }.call(this));
    }
}