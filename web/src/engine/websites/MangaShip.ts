import { Tags } from '../Tags';
import icon from './MangaShip.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const pageScript = `
    new Promise(async (resolve, reject) => {

        async function fetchImageUrl(obj) {
            return await $.post("/PartialView/SifreCoz", obj);
        }
        try {
            const matches = document.body.innerHTML.matchAll(/{\\s*"id":\\s*'([^,]+)',\\s*"token"/g);
            const token = getTokenValue();
            const parsedMatches = [];
            for (const match of matches) {
                const obj = {
                    id: match[1],
                    token
                };
                parsedMatches.push(obj);
            }
            const images = await Promise.all(parsedMatches.map(async parameter => {
                return fetchImageUrl(parameter);
            }));

            resolve(images.map(image => new URL(image, window.location.origin).href));
        } catch (error) {
            reject(error)
        }
    });

`;

function MangaExtractor(element: HTMLElement) {
    return {
        title: element.title.trim(),
        id: element.getAttribute('onclick').match(/location\.href='(.*)'/)[1]
    };
}

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        title: anchor.text.trim(),
        id: anchor.getAttribute('onclick').match(/location\.href='(.*)'/)[1]
    };
}

@Common.MangaCSS(/^{origin}\/Tr\/Manga\/[^/]+$/, 'ul.breadcrumb li:last-of-type')
@Common.MangasMultiPageCSS('/Tr/Mangalar?page={page}', 'div.zaman', 1, 1, 0, MangaExtractor)
@Common.ChaptersSinglePageCSS('div.plylist-single-content > a[onclick]', ChapterExtractor) //some chapters are mobile app only
@Common.PagesSinglePageJS(pageScript, 500)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaship', `Manga Ship`, 'https://mangaship.net', Tags.Language.Turkish, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}