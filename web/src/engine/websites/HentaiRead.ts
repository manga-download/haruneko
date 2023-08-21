import { Tags } from '../Tags';
import icon from './HentaiRead.webp';
import { Chapter, DecoratableMangaScraper, Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const pageScript = `new Promise(resolve => {
    const pagelist = chapter_preloaded_images;
    resolve(pagelist.map(link => {
        let uri = new URL(link);
        uri.searchParams.set('quality', '100');
        uri.searchParams.delete('w');
        return uri.href;
    }));
});
`;


@Common.MangaCSS(/^https?:\/\/hentairead\.com\/hentai\/[^/]+\/$/, 'div.post-title h1')
@Common.MangasMultiPageCSS('/hentai/page/{page}/','div.post-title a')
@Common.ChaptersSinglePageCSS('div.summary_image > a')
@Common.PagesSinglePageJS(pageScript)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hentairead', 'HentaiRead', 'https://hentairead.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }

}