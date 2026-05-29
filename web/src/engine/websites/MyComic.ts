import { Tags } from '../Tags';
import icon from './MyComic.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchRegex } from '../platform/FetchProvider';

type JSONChapter = {
    id: string;
    title: string;
};

@Common.MangaCSS(/^{origin}\/comics\/\d+$/, 'div[data-flux-breadcrumbs] > div:last-of-type')
@Common.MangasMultiPageCSS('div.grid div.group.relative', Common.PatternLinkGenerator('/comics?page={page}'), 0,
    element => ({ id: element.querySelector<HTMLAnchorElement>('a').pathname, title: element.querySelector<HTMLDivElement>('div[data-flux-subheading]').textContent.trim() }))
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
            result.push(...chapters.map(({ id, title }) => new Chapter(this, manga, `/chapters/${id}`, title.trim())));
        }
        return result;
    }
}