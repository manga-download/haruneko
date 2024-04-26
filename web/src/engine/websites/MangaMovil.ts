import { Tags } from '../Tags';
import icon from './MangaMovil.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const pageScript = `
    new Promise( resolve => {
        const dom = new DOMParser().parseFromString(video[0], 'text/html');
        resolve( [...dom.querySelectorAll('img')].map( image => image.dataset.src) );
    });
 `;

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('span.sa-series-link__number').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.video-card-body div.video-title')
@Common.MangasMultiPageCSS('/biblioteca?page={page}', 'div.card-body a.text-white')
@Common.ChaptersSinglePageCSS('ul.list-group a.new-link', ChapterExtractor)
@Common.PagesSinglePageJS(pageScript, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangamovil', 'MangaMovil', 'https://mangamovil.net', Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}