import { Tags } from '../Tags';
import icon from './ShinigamiID.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

const pageScript = `
    new Promise((resolve, reject) => {
        const key = post_id + 'hJ1nA7qt0fMxGPfW3WlD5QuRy1HBTOnukhP9JE' + post_id + 'aBTSjD3cSKEJEKMI34mSxRUm98Xu4hXp71YTWJ5lUnP' + post_id;
        const imgdata = JSON.parse(CryptoJS.AES.decrypt(chapter_data, key, {
            format: CryptoJSAesJson
        }).toString(CryptoJS.enc.Utf8));
        resolve(imgdata);
    });
`;

@Madara.MangaCSS(/^https?:\/\/\d+\.shinigami\.asia\/series\/[^/]+\/$/, 'div.post-title h1')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageCSS()
@Common.PagesSinglePageJS(pageScript, 750)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shinigamiid', `Shinigami ID`, 'https://08.shinigami.asia', Tags.Language.Indonesian, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Scanlator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript<string>(new Request(this.URI), 'window.location.origin');
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }
}