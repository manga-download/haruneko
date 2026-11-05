import { Tags } from '../Tags';
import icon from './MangaBahcesi.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const pageScript = `
    new Promise(async (resolve, reject) => {
        async function fetchImageUrl(obj) {
            return await $.post("/PartialView/SifreCoz", obj);
        }
        try {
            const matches = document.body.innerHTML.matchAll(/{\\s*"id":\\s*'([^,]+)',\\s*"token"/gm);
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

@Common.MangaCSS(/^{origin}\/Tr\/Manga\/[^/]+$/, 'ul.breadcrumb li:last-of-type')
@Common.MangasMultiPageCSS('div.products div.zaman a', Common.PatternLinkGenerator('/Tr/Mangalar?page={page}'), 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('div.plylist-single-content > a[onclick]', undefined,
    anchor => ({ id: anchor.getAttribute('onclick').match(/location\.href='(.*)'/).at(1), title: anchor.text.trim() })) //some chapters are mobile app only
@Common.PagesSinglePageJS(pageScript, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaship', 'Manga Bahçesi', 'https://mangabahcesi.com', Tags.Language.Turkish, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}