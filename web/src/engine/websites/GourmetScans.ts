import { Tags } from '../Tags';
import icon from './GourmetScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

const pageScript = `
    new Promise( (resolve, reject) => {
        const start = Date.now();
        const interval = setInterval(function () {
            try {
                if (CryptoJS) {
                    clearInterval(interval);
                    let imgdata = JSON.parse(CryptoJS.AES.decrypt(chapter_data, wpmangaprotectornonce, {
                        format: CryptoJSAesJson
                    }).toString(CryptoJS.enc.Utf8));
                    resolve(JSON.parse(imgdata));
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
       window.dispatchEvent(new KeyboardEvent('keydown'));

    });
`;

@Madara.MangaCSS(/^{origin}\/project\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="Gourmet Scans"])')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Common.PagesSinglePageJS(pageScript, 5000)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gourmetscans', 'Gourmet Scans', 'https://gourmetsupremacy.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}