import { Tags } from '../Tags';
import icon from './MangaPure.webp';
import type { Manga } from '../providers/MangaPlugin';
import { Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchCSS, FetchRequest } from '../FetchProvider';

type MangaID = {
    post: string,
    slug: string
}

@Madara.MangaCSS(/^{origin}\/read\/[^/]+$/, 'div.post-title')
@Madara.MangasMultiPageCSS(undefined, undefined, '/popular-manga?page={page}')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangapure', 'MangaPure (manganelos)', 'https://mangapure.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaid: MangaID = JSON.parse(manga.Identifier);
        const request = new FetchRequest(new URL(`/ajax-list-chapter?mangaID=${mangaid.post}`, this.URI).href, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                Referer: this.URI.origin
            }
        });
        const data = await FetchCSS<HTMLAnchorElement>(request, 'li.wp-manga-chapter a');
        return data.map(chapter => new Chapter(this, manga, chapter.pathname, chapter.text.trim()));
    }
    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new FetchRequest(new URL(chapter.Identifier, this.URI).href);
        const data = await FetchCSS(request, 'p#arraydata');
        return data[0].textContent.split(',').map(link => new Page(this, chapter, new URL(link)));
    }

}