import { Tags } from '../Tags';
import icon from './ManhwasNet.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const pagesScript = `
new Promise((resolve, reject) => {
        try {
            const images = [...document.querySelectorAll('div#chapter_imgs img[src]:not([src=""])')].map(image => image.src);
            resolve(images);
        } catch (error) {
            reject(error);
        }
});
`;
function MangaExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('h3.title').textContent.trim();
    return { id, title };
}

function ChapterExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('p span').textContent.trim();
    return { id, title };
}

@Common.MangaCSS(/^https?:\/\/manhwas\.net\/manga\/[^/]+$/, 'article.anime-single h1.title')
@Common.MangasMultiPageCSS('/biblioteca?page={page}', 'article.anime a', 1, 1, 0, MangaExtractor)
@Common.ChaptersSinglePageCSS('li a.fa-book', ChapterExtractor)
@Common.PagesSinglePageJS(pagesScript, 2500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwasnet', 'Manhwas', 'https://manhwas.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }
}