import { Tags } from '../Tags';
import icon from './ReadComicOnline.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    const link = new URL(anchor.href);
    link.searchParams.set('readType', '1');
    link.searchParams.set('quality', 'hq');
    return {
        id: link.pathname + link.search,
        title: anchor.text.trim()
    };
}

const pageScript = `
    new Promise( (resolve, reject) => {
        let tries = 0;
        const interval = setInterval(function () {
            try {
                const links = [ ...document.querySelectorAll('#divImage img') ].map(img => img.src);
                if(links.length > 0 && !links.some(link => /blank.gif/i.test(link))) {
                    clearInterval(interval);
                    resolve(links);
                }
            } catch (error) {
                clearInterval(interval);
                reject(error);
            } finally {
                tries++;
                if (tries > 10) {
                    clearInterval(interval);
                    reject(new Error('Unable to get pictures after more than 10 tries !'));
                }
            }
        }, 1000);
    });

`;

@Common.MangaCSS(/^{origin}\/Comic\/[^/]+$/, 'div.barContent a.bigChar')
@Common.MangasMultiPageCSS('/ComicList?page={page}', 'table.listing td a')
@Common.ChaptersSinglePageCSS('div.episodeList table.listing tr td:first-of-type a, div.section ul.list li a', ChapterExtractor)
@Common.PagesSinglePageJS(pageScript, 1000) //may trigger a captcha request
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('readcomiconline', `ReadComicOnline`, 'https://readcomiconline.li', Tags.Language.English, Tags.Media.Comic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('list-view', 'list')`);
    }

}