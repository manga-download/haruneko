import { Tags } from '../../Tags';
import icon from './Ohtabooks.webp';
import { Chapter, DecoratableMangaScraper, type Manga, type Page } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import * as SpeedBinb from '../decorators/SpeedBinb';
import { FetchCSS, FetchRequest } from '../../FetchProvider';

function MangaExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('.title').textContent.trim();
    return { id, title };
}

@Common.MangaCSS(/^https?:\/\/webcomic\.ohtabooks\.com\/\S+\/$/, 'h2.contentTitle')
@Common.MangasSinglePageCSS('/list/', 'div.bnrList ul li a', MangaExtractor)
@SpeedBinb.ImageDescrambler()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ohtabooks', `Ohtabooks`, 'http://webcomic.ohtabooks.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        //find real reader url to send to SpeedBinb, since redirection is done by Javascript
        const data = await FetchCSS<HTMLBodyElement>(new FetchRequest(chapter.Identifier), 'body');
        const reallink = data[0].innerHTML.match(/location.href='(.*)'/)[1];
        return await SpeedBinb.FetchPagesSinglePage.call(this, new Chapter(this, chapter.Parent as Manga, reallink, chapter.Title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL(manga.Identifier, this.URI);
        const data = await FetchCSS(new FetchRequest(uri.href), 'a[onClick^="return !openBook("]');
        let chapterList = data.map(element => {
            let partId = element.getAttribute('onclick');
            partId = partId.match(/\d+/)[0];

            let title = element.querySelector('.title') ? element.querySelector('.title').textContent : element.querySelector('btnMini') ? element.querySelector('btnMini').textContent : 'マンガをよむ';
            title = title.trim();
            return {
                id: 'https://yondemill.jp/contents/' + partId + '?view=1&u0=1',
                title: title
            };
        });
        // Remove duplicates
        chapterList = chapterList.reverse().filter((chapter, index) => {
            return index === chapterList.findIndex(c => c.id === chapter.id);
        });

        return chapterList.map(chapter => new Chapter(this, manga, chapter.id, chapter.title));
    }
}