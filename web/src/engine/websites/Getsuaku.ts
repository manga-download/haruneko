import { Tags } from '../Tags';
import icon from './Getsuaku.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { FetchJSON, FetchRequest, FetchWindowScript } from '../FetchProvider';

type APIChapters = {
    objects: {
        id: number,
        book_id: number,
        title: string,
        episode_number: string,
        cid : string
    }[]
}

function MangaExtractor(element: HTMLElement) {
    return {
        id: element.querySelector<HTMLAnchorElement>('div.button a.button__link-dark').pathname,
        title: element.querySelector('div.comics__name').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/episode\/[^/]+$/, 'div.detail__main h2.detail__title')
@Common.MangasSinglePageCSS('/series', 'div.comics__grid div.comics__gridItem', MangaExtractor)
@SpeedBinb.PagesSinglePageAjax()
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('getsuaku', `Getsuaku`, 'https://getsuaku.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const bookid = await FetchWindowScript<string>(new FetchRequest(new URL(manga.Identifier, this.URI).href), 'book_id', 1500);
        const url = new URL(`/api/sort_episodes?book_id=${bookid}&order=asc&mode=all`, this.URI);
        const chapters = await FetchJSON<APIChapters>(new FetchRequest(url.href));
        return chapters.objects.map(chapter => new Chapter(this, manga, `/episode/${chapter.cid}`, chapter.episode_number.trim()));
    }

}