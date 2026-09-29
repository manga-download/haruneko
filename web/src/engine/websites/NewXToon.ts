import { Tags } from '../Tags';
import icon from './NewXToon.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIChapters = {
    chapters: {
        id: number;
        title: string;
    }[];
};

@Common.MangaCSS(/^{origin}\/comics\/\d+$/, '#comic-title')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div#comic-list a.comic-link:not([href*="/ads/"])', Common.PatternLinkGenerator('/comics?page={page}'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('h3[title]').getAttribute('title').trim()
}))
@Common.PagesSinglePageCSS('div.reader-canvas img.reader-page')
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('newxtoon', 'NewXToon', 'https://newxtoon1.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Korean, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { chapters: chaptersData } = await FetchJSON<APIChapters>(new Request(new URL(`.${manga.Identifier}/chapters?page=${page}&sort=latest`, this.URI)));
                const chapters = chaptersData.map(({ id, title }) => new Chapter(this, manga, `${manga.Identifier}/chapters/${id}`, title.replace(manga.Title, '').replace(/^\s*-\s*/, '').trim() ?? title));
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
    }
}