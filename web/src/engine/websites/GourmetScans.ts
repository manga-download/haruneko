import { Tags } from '../Tags';
import icon from './GourmetScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

const pageScript = `
    new Promise((resolve, reject) => {
        try {
            let t = new RocketLazyLoadScripts;
            t._loadEverythingNow();
        } catch (error) {}

        setTimeout(() => {
            var imgdata = JSON.parse(CryptoJS.AES.decrypt(chapter_data, wpmangaprotectornonce, {
                format: CryptoJSAesJson
            }).toString(CryptoJS.enc.Utf8));
            resolve(JSON.parse(imgdata));
        }, 2500);
    });
`;

@Madara.MangaCSS(/^{origin}\/project\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="Gourmet Scans"])')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Common.PagesSinglePageJS(pageScript)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gourmetscans', 'Gourmet Scans', 'https://gourmetsupremacy.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}