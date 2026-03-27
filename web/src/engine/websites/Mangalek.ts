import { Tags } from '../Tags';
import icon from './Mangalek.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.post-title')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangalek', 'مانجا ليك (Mangalek)', 'https://lek-manga.net', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Arabic);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        //trigger Cloudflare at initialization
        return await FetchWindowScript(new Request(new URL('/manga/-/', this.URI)), '');
    }
}