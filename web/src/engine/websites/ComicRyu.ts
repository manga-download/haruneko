import { Tags } from '../Tags';
import icon from './ComicRyu.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

const pageScript =`
    new Promise(resolve => {
        resolve(photoArray.map(photo => new URL(photoDir + photo[0], window.location).href));
    });
`;

function MangaExtractor(element: HTMLImageElement) {
    return element.alt.trim();
}

function MangaInfoExtractor(element: HTMLElement) {
    const id = element.querySelector<HTMLAnchorElement>('a').pathname;
    const title = element.querySelector('h1.m-lineup-piece-title').textContent.trim();
    return { id, title };
}

@Common.MangaCSS(/^{origin}\/_[^/]+\/index.html/, 'div#detail div.titlepage h2 img', MangaExtractor)
@Common.MangasSinglePageCSS('/lineup/', 'article.m-lineup-piece', MangaInfoExtractor)
@Common.PagesSinglePageJS(pageScript)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicryu', `COMICリュウ`, 'https://www.comic-ryu.jp', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public async Initialize(): Promise<void> {
        return;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(manga.Identifier, this.URI).href);
        const chapters = await FetchCSS<HTMLAnchorElement>(request, 'div#read ul.readlist li p.readbtn a');
        return chapters.map(anchor => {
            const url = manga.Identifier.replace('/index.html', anchor.pathname);
            const title = anchor.text.trim();
            return new Chapter(this, manga, url, title);
        });
    }
}