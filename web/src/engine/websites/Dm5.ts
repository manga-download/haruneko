import { Tags } from '../Tags';
import icon from './Dm5.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as DM5 from './decorators/DM5';

const labelExtractor = Common.ElementLabelExtractor('span.right');
const chapterExtractor = Common.AnchorInfoExtractor(false, 'div.cover, p.subtitle, p.tip, span');
@Common.MangaCSS(/^{origin}\/manhua-/, 'div.info p.title', labelExtractor)
@Common.MangasMultiPageCSS('/manhua-list-p{page}/', 'ul li div.mh-item-detali h2.title a')
@Common.ChaptersSinglePageCSS('div#chapterlistload ul li a', chapterExtractor)
@DM5.PagesSinglePageScript()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('dm5', 'DM5 漫画', 'https://www.dm5.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Language.Chinese/*, Tags.Source.Official*/);
    }

    public override async Initialize(): Promise<void> {
        const request = new Request(this.URI.href);
        return FetchWindowScript(request, `window.cookieStore.set('isAdult', '1')`);
    }

    public override get Icon() {
        return icon;
    }
}