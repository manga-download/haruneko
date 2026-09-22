import { Tags } from '../Tags';
import icon from './HeavenManga2.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIChapter = {
    data: {
        slug: string;
        id: number;
    }[];
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.site-content div.post-title h3')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.page-item-detail div.photo a.thumbnail', Common.PatternLinkGenerator('/top?page={page}'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('img').alt.trim()
}))
@Common.PagesSinglePageJS(`window.pUrl.map(page => page.imgURL);`, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('heavenmanga2', `HeavenManga`, 'https://heavenmanga.com', Tags.Language.Spanish, Tags.Source.Aggregator, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        // website chapter sorting is a mess, do it ourselves
        const collator = new Intl.Collator(undefined, {
            numeric: true,
            sensitivity: 'base'
        });
        const { data } = await FetchJSON<APIChapter>(new Request(new URL(manga.Identifier, this.URI), {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }));
        return data
            .map(({ id, slug }) => new Chapter(this, manga, `/manga/leer/${id}`, `Chapter ${slug}`))
            .sort((self, other) => collator.compare(other.Title, self.Title));
    }
}