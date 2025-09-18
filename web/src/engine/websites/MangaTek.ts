import { Tags } from '../Tags';
import icon from './MangaTek.webp';
import { type Manga, Chapter, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

type HydratedChapter = {
    chapter_number: string;
    title: string;
};

const chapterScript = `
    new Promise(resolve => {
        const element = document.querySelector('astro-island[component-url*="MangaChaptersLoader"]');
        element.hydrator = () => (_, props) => resolve(props.manga.MangaChapters);
        element.hydrate();
    });
`;

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'img#mangaCover', (element: HTMLImageElement) => element.alt.trim())
@Common.MangasMultiPageCSS('/manga-list?page={page}', 'div.manga-card a[dir]')
@Common.PagesSinglePageCSS('div.manga-page img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatek', 'MangaTek', 'https://mangatek.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Arabic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await FetchWindowScript<HydratedChapter[]>(new Request(new URL(manga.Identifier, this.URI)), chapterScript, 1500);
        return chapters.map(({ title, chapter_number: number }) => new Chapter(this, manga, `/reader/${manga.Identifier.split('/').at(-1)}/${number}`, title));
    }
}