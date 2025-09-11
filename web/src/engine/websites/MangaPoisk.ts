import { Tags } from '../Tags';
import icon from './MangaPoisk.webp';
import { Chapter } from '../providers/MangaPlugin';
import { DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';

type APIResult<T> = {
    props: T
};

type APIChapters = {
    chapters: {
        data: {
            link: string;
            title: string;
        }[]
    }
};

type JSONAPP = {
    version: string;
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+/, 'header.card-header h1 span')
@Common.MangasMultiPageCSS('/manga?page={page}', 'div.grid div.manga-card > a')
@Common.PagesSinglePageCSS('img[data-page]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private apiVersion: string = '5b848c59da46cd7956567ddcf21104f6';

    public constructor() {
        super('mangapoisk', 'MangaPoisk', 'https://mangapoisk.io', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Russian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        const [app] = await FetchCSS<HTMLDivElement>(new Request(new URL(this.URI)), 'div#app');
        this.apiVersion = (JSON.parse(app.dataset.page) as JSONAPP).version;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters: { data } } = await this.FetchAPI<APIChapters>(`${manga.Identifier}?tab=chapters`);
        return data.map(({ link, title }) => new Chapter(this, manga, link, title));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return (await FetchJSON<APIResult<T>>(new Request(new URL(endpoint, this.URI), {
            headers: {
                'Content-Type': 'application/json',
                'X-Inertia': 'true',
                'X-Inertia-Version': this.apiVersion
            }
        }))).props;
    }
}