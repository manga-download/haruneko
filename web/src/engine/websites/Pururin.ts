import { Tags } from '../Tags';
import icon from './Pururin.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const pageScript = `
    new Promise (resolve => {
        const element = document.querySelector('.img-viewer');
        const imgdata = JSON.parse(element.dataset['img']);
        resolve( imgdata.images.map( image => new URL( [imgdata.directory, image.filename].join('/'), element.dataset.svr).href));
    })
`;

function MangaInfoExTractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLImageElement>('img.card-img-top').getAttribute('alt').trim()
    };
}

function ChapterExtractor(element: HTMLDivElement) {
    return {
        id: element.querySelector<HTMLAnchorElement>('div.cover-wrapper a').pathname,
        title: element.querySelector<HTMLSpanElement>('div.title h1 span').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/gallery\/\d+\//, 'div.title h1 span')
@Common.MangasMultiPageCSS('/?page={page}', 'a.card.card-gallery', 1, 1, 0, MangaInfoExTractor)
@Common.ChaptersSinglePageCSS('div.gallery-wrapper', undefined, ChapterExtractor)
@Common.PagesSinglePageJS(pageScript, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('pururin', `Pururin`, 'https://pururin.me', Tags.Language.English, Tags.Media.Manga, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}