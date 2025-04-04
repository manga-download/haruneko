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
        const images = document.querySelectorAll('#divImage img');
        LoadNextPages(images.length);
        const start = Date.now();
        const interval = setInterval(function () {
            try {
                if ([...images].at(-1).style.backgroundImage != '') {
                    clearInterval(interval);
                    resolve([ ...images ].map(img => img.style.backgroundImage.slice(4, -1).replace(/["']/g, '').replace('=s1600?', '=s0?')));
                }
            } catch (error) {
                clearInterval(interval);
                reject(error);
            } finally {
                if(Date.now() - start > 10_000) {
                    clearInterval(interval);
                    reject(new Error('Unable to get pictures after more than 10 seconds !'));
                }
            }
        }, 1000);
    });
`;

@Common.MangaCSS(/^{origin}\/Comic\/[^/]+$/, 'div.barContent a.bigChar')
@Common.MangasMultiPageCSS('/ComicList?page={page}', '.list-comic .item > a')
@Common.ChaptersSinglePageCSS('div.episodeList table.listing tr td:first-of-type a, div.section ul.list li a', ChapterExtractor)
@Common.PagesSinglePageJS(pageScript, 2500)
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