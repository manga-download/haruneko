import { Tags } from '../Tags';
import icon from './Tibiu.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type Manga, Chapter } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIChapters = {
    data: {
        link: string;
        name: string;
    }[];
};

@Common.MangaCSS(/^{origin}\/comic\/\d+$/, 'h2.comicInfo__title')
@Common.MangasMultiPageCSS('https://comic.tibiu.net/search/_/{page}', 'div.cate-comic-list p.comic__title > a')
@Common.PagesSinglePageCSS('div[data-pid] > img[data-original]:not([data-original$="boylove.cc"])', img => img.dataset.original)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://comic.tibiu.net/index.php/api/';

    public constructor () {
        super('tibiu', 'Tibiu', 'https://comic.tibiu.net', Tags.Media.Manga, Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Official, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data } = await FetchJSON<APIChapters>(new Request(new URL('./comic/chapter?mid=' + manga.Identifier.split('/').at(-1), this.apiURL)));
        return data.map(chapter => new Chapter(this, manga, new URL(chapter.link, this.URI).pathname, chapter.name.trim()));
    }
}