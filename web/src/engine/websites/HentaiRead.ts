import { Tags } from '../Tags';
import icon from './HentaiRead.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const pageScript = `
    new Promise((resolve, reject) => {
        try {
            const pagelist = (window.chapterImages ?? window.chapter_preloaded_images);
            resolve(pagelist.map(image => {
                const uri = new URL(image.src);
                uri.searchParams.set('quality', '100');
                uri.searchParams.delete('w');
                return uri.href;
            }));
        } catch (error) {
            reject(error);
        }
    });
`;

@Common.MangaCSS(/^{origin}\/hentai\/[^/]+\/$/, 'div.post-title h1')
@Common.MangasMultiPageCSS('/hentai/page/{page}/', 'div.post-title a')
@Common.ChaptersSinglePageCSS('div.summary_image > a')
@Common.PagesSinglePageJS(pageScript, 500)
@Common.ImageAjax(false, true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hentairead', 'HentaiRead', 'https://hentairead.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

}