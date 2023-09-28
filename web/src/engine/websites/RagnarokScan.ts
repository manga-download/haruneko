import { Tags } from '../Tags';
import icon from './RagnarokScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

function ChapterExtractor(element: HTMLAnchorElement) {
    const id = element.pathname;
    const title = element.querySelector('.chapter-manhwa-title').textContent.trim();
    return { id, title };

}

@Madara.MangaCSS(/^https?:\/\/ragnarokscan\.com\/series\/[^/]+\/$/, 'div.post-title h1')
@Madara.MangasMultiPageAJAX('div.series-box a')
@Madara.ChaptersSinglePageCSS(undefined, ChapterExtractor)
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ragnarokscan', 'RagnarokScan', 'https://ragnarokscan.com', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Spanish);
    }

    public override get Icon() {
        return icon;
    }
}
