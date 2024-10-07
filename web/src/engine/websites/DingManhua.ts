import { Tags } from '../Tags';
import icon from './DingManhua.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIChapters = {
    data: {
        chapters: {
            id: number,
            contentId: number,
            chapterName : string
        }[]
    }
}

@Common.MangaCSS(/^{origin}\/comic\/\d+\.html$/, 'div.info > p')
@Common.MangasMultiPageCSS('/sort?category=0&tag=0&page={page}', 'div.card-content > a')
@Common.PagesSinglePageCSS('div#comicContainer img.comic-image')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('dingmanhua', 'DingManhua', 'https://www.dingmanhua.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Chinese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const [mangaID] = manga.Identifier.match(/\d+/);
        const { data: { chapters } } = await FetchJSON<APIChapters>(new Request(new URL(`/comic/${mangaID}`, this.URI), {
            method: 'POST',
            headers: {
                Origin: this.URI.origin,
                Referer: new URL(manga.Identifier, this.URI).href
            }
        }));
        return chapters.map(chapter => new Chapter(this, manga, `/chapter/${chapter.contentId}-${chapter.id}.html`, chapter.chapterName));
    }
}