import { Tags } from '../Tags';
import icon from './Ohtabooks.webp';
import { Chapter, DecoratableMangaScraper, type Manga, type Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { FetchCSS } from '../platform/FetchProvider';
import { SpeedBindVersion } from './decorators/SpeedBinb';

function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('.title').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/[^/]+\/$/, 'h2.contentTitle')
@Common.MangasSinglePagesCSS(['/list/'], 'div.bnrList ul li a', MangaExtractor)
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ohtabooks', `Ohtabooks`, 'https://webcomic.ohtabooks.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        //find real reader url to send to SpeedBinb, since redirection is done by Javascript
        const [ data ] = await FetchCSS<HTMLBodyElement>(new Request(chapter.Identifier), 'body');
        const reallink = data.innerHTML.match(/location.href='(.*)'/).at(1);
        return SpeedBinb.FetchPagesSinglePageAjax.call(this, new Chapter(this, chapter.Parent as Manga, reallink, chapter.Title), SpeedBindVersion.v016130);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const data = await FetchCSS(new Request(new URL(manga.Identifier, this.URI)), 'a[onClick^="return !openBook("]');
        const chapterList = data.map(element => {
            const partId = element.getAttribute('onclick').match(/\d+/).at(0);
            const title = element.querySelector('.title') ? element.querySelector('.title').textContent : element.querySelector('btnMini') ? element.querySelector('btnMini').textContent : 'マンガをよむ';
            return new Chapter(this, manga, `https://yondemill.jp/contents/${partId}?view=1&u0=1`, title.trim());
        });
        return chapterList.reverse().distinct();
    }
}