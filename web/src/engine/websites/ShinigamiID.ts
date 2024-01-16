import { Tags } from '../Tags';
import icon from './ShinigamiID.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Madara from './decorators/WordPressMadara';

const pageScript = `
    new Promise((resolve, reject) => {
        const key = post_id + 'hJ1nA7qt0fMxGPfW3WlD5QuRy1HBTOnukhP9JE' + post_id + 'aBTSjD3cSKEJEKMI34mSxRUm98Xu4hXp71YTWJ5lUnP' + post_id;
        const imgdata = JSON.parse(CryptoJS.AES.decrypt(chapter_data, key, {
            format: CryptoJSAesJson
        }).toString(CryptoJS.enc.Utf8));
        resolve((imgdata));
    });
`;

@Madara.MangaCSS(/^{origin}\/series\/[^/]+\/$/, 'div.post-title h1')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Common.PagesSinglePageJS(pageScript, 800)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shinigamiid', `Shinigami ID`, 'https://shinigamitoon.com', Tags.Language.Indonesian, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}
