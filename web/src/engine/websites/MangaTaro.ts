import { Tags } from '../Tags';
import { FetchJSON } from '../platform/FetchProvider';
import { Manga, type MangaPlugin, DecoratableMangaScraper } from '../providers/MangaPlugin';
import icon from './MangaTaro.webp';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'button[data-manga-title]', (element) => element.dataset.mangaTitle.trim())
@Common.ChaptersSinglePageCSS('div.chapter-list  a', Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageCSS('img.comic-image')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangataro', 'MangaTaro', 'https://mangataro.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const mangas = await FetchJSON<{title: string, url: string}[]>(new Request(new URL('/wp-json/manga/v1/load', this.URI), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                page,
                search: '',
                years: '[]',
                genres: '[]',
                types: '[]',
                statuses: '[]',
                sort: 'post_desc',
                genreMatchMode: 'any'
            })
        }));
        return mangas.map(({ url, title }) => new Manga(this, provider, new URL(url).pathname, title));
    }
}