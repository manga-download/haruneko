import { Tags } from '../Tags';
import icon from './MyComic.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchRegex } from '../platform/FetchProvider';

type JSONChapter = {
    id: string,
    title: string
}

function MangaExtractor(element: HTMLDivElement) {
    return {
        id: element.querySelector<HTMLAnchorElement>('a').pathname,
        title: element.querySelector<HTMLDivElement>('div[data-flux-subheading]').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/comics\/\d+$/, 'div[data-flux-breadcrumbs] > div:last-of-type')
@Common.MangasMultiPageCSS('/comics?page={page}', 'div.grid div.group.relative', 1, 1, 0, MangaExtractor)
@Common.PagesSinglePageCSS('img.page')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mycomic', 'MyComic', 'https://mycomic.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Media.Comic, Tags.Language.Chinese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const result: Chapter[] = [];
        const matchedStringsArray = await FetchRegex(new Request(new URL(manga.Identifier, this.URI)), /chapters\s*:\s*(\[.*\])/g);
        for (const strMatch of matchedStringsArray) {
            const chapters: JSONChapter[] = JSON.parse(strMatch);
            result.push(...chapters.map(chapter => new Chapter(this, manga, `/chapters/${chapter.id}`, chapter.title.trim())));
        }
        return result;
    }

}