import { Tags } from '../Tags';
import icon from './HattoriManga.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';

type APIChapters = {
    chapters: {
        chapter_slug: string;
        title: string;
        subtitle: string;
    }[]
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.anime-details-title h3')
@Common.MangasMultiPageCSS('/manga?page={page}', 'div.product-card h5 a')
@Common.PagesSinglePageCSS('div.image-wrapper img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hattorimanga', 'Hattori Manga', 'https://hattorimanga.net', Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const [ { content: token } ] = await FetchCSS<HTMLMetaElement>(new Request(this.URI), 'meta[name="csrf-token"]');
        const chapterList: Chapter[] = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page, token);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }

    private async GetChaptersFromPage(manga: Manga, page: number, token: string): Promise<Chapter[]> {
        const { chapters } = await FetchJSON<APIChapters>(new Request(new URL(`/load-more-chapters/${manga.Identifier.split('/').at(-1)}?page=${page}`, this.URI), {
            headers: { 'X-CSRF-TOKEN': token }
        }));
        return chapters.map(({ chapter_slug: slug, title, subtitle }) => new Chapter(this, manga, [ manga.Identifier, slug ].join('/'), [ title, subtitle ].join(' ').trim()));
    }
}