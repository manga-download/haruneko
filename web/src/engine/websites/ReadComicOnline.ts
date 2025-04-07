import { Tags } from '../Tags';
import icon from './ReadComicOnline.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

const pageScript = `
    new Promise( resolve => {
        const regexp = /\\.attr\\('src',\\s*([^\\(]+)\\(([^\\[]+)\\[currImage\\]\\)/;
        const matches = document.documentElement.innerHTML.match(regexp);
        const imageArray = eval(matches[2]);
        const decodingFunc = eval(matches[1]);
        resolve( imageArray.map(image => decodingFunc(image) ));
    });
`;

@Common.MangaCSS(/^{origin}\/Comic\/[^/]+$/, 'div.barContent a.bigChar')
@Common.MangasMultiPageCSS('/ComicList?page={page}', '.list-comic .item > a')
@Common.ChaptersSinglePageCSS('div.episodeList table.listing tr td:first-of-type a, div.section ul.list li a')
@Common.PagesSinglePageJS(pageScript, 1000)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('readcomiconline', `ReadComicOnline`, 'https://readcomiconline.li', Tags.Language.English, Tags.Media.Comic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `
            window.cookieStore.set('rco_readType', '1');
            window.cookieStore.set('rco_quality', 'hq');
        `);
    }

}