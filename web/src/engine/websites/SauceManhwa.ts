import { Tags } from '../Tags';
import icon from './SerenityScans.webp';
import { DecoratableMangaScraper, type Manga, Chapter } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    comic: {
        chapters: {
            id: number;
            name: string;
            slug: string;
        }[]
    }
};

@Common.MangaCSS(/^{origin}\/[^/]+$/, 'h1[itemprop="name"]')
@Common.MangasMultiPageCSS('main div.container section > div.grid a.block.text-white', Common.PatternLinkGenerator('/list/comic-updated?page={page}'))
@Common.PagesSinglePageCSS('div.image-item img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('saucemanhwa', 'SauceManhwa', 'https://saucemanhwa.org', Tags.Media.Manhwa, Tags.Language.Polish, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { comic: { chapters } } = await FetchJSON<APIManga>(new Request(new URL(`/baseapi/comics/getComic/${manga.Identifier}`, this.URI)));
        return chapters.map(chapter => new Chapter(this, manga, `${manga.Identifier}/${chapter.slug}`, `Chapter ${chapter.name}`));
    }
}