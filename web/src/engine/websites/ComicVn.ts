import { Tags } from '../Tags';
import icon from './ComicVn.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

const chapterScript = `
    new Promise ( resolve => {
        resolve( [...document.querySelectorAll('div.listChapters ul li > a')].map(chapter => {
            const titleElement = chapter.querySelector('span.titleComic');
            const vipBloat = titleElement.querySelector('.vip-chapter');
            if ( vipBloat ) vipBloat.parentElement.removeChild(vipBloat);
            return {
                id: chapter.pathname,
                title : titleElement.textContent.trim()
            }
        }));
    });
`;

@Common.MangaCSS(/^https:\/\/comicvn\d+\.net\/[^/]+\.html$/, 'div.detailComic div.preface div.detail h1')
@Common.MangasMultiPageCSS('/danh-muc/truyen-moi?page={page}', 'div.listComic ul li div.detail h3 a')
@Common.ChaptersSinglePageJS(chapterScript, 1500)
@Common.PagesSinglePageCSS('div.readComic div#lightgallery2 img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicvn', 'ComicVn', 'https://comicvn9.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Vietnamese, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript(new Request(this.URI), `window.location.origin`, 1500);
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }
}