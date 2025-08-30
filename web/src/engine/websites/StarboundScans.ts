import { Tags } from '../Tags';
import icon from './StarboundScans.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

type JSONMangas = {
    id: string;
    title: string;
}[];

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'h1.project-title')
@Common.ChaptersSinglePageCSS('div.chapter-item a')
@Common.PagesSinglePageCSS('div.page-container img.wp-manga-chapter-img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('starboundscans', 'Starbound Scans', 'https://starboundscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.French, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const script = `
            mangaData.mangas.map(({ title, permalink }) => ({
                id: new URL(permalink, window.location).pathname,
                title: new DOMParser().parseFromString(title, 'text/html').body.innerText.trim(),
            }));
        `;
        const mangas = await FetchWindowScript<JSONMangas>(new Request(new URL('/projets', this.URI)), script);
        return mangas.map(({ id, title }) => new Manga(this, provider, id, title));
    }
}