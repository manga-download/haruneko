import { Tags } from '../Tags';
import icon from './ReadComicOnline.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

const pageScript = `
  new Promise( resolve => {
        const regexp =  /\\s*(\\w+)\\s*\\(\\s*\\d+\\s*,\\s*(\\w+)\\s*\\[/;
        let imageArray = undefined;
        let decodingFunc = undefined;
        const script = [...document.querySelectorAll('script:not([src])')].find(scr => {
            const matches = scr.text.match(regexp);
            if(!matches) return false;
            try {
                decodingFunc = window[matches[1]];
                imageArray = window[matches[2]];
                return imageArray instanceof Array && typeof decodingFunc === 'function';
            } catch {}
            return false;
        });
        resolve( imageArray.map(image => decodingFunc(1337, image) ));
    });
`;

@Common.MangaCSS(/^{origin}\/Comic\/[^/]+$/, 'div.barContent a.bigChar')
@Common.MangasMultiPageCSS('/ComicList?page={page}', '.list-comic .item > a')
@Common.ChaptersSinglePageCSS('div.episodeList table.listing tr td:first-of-type a, div.section ul.list li a')
@Common.PagesSinglePageJS(pageScript, 2500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor () {
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