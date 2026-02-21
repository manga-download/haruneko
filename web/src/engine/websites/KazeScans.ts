import { Tags } from '../Tags';
import icon from './KazeScans.webp';
import { PageLinkExtractor, ZeistManga } from './templates/ZeistManga';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/\d+\/\d+\/[^/]+\.html$/, 'h1.series-title')
@Common.PagesSinglePageCSS('div.reader-content div.separator a img', PageLinkExtractor)
export default class extends ZeistManga {
    public constructor() {
        super('kazescans', 'Kaze Scans', 'https://www.kazescans.com', Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Source.Scanlator);
        this.WithMangaSlugScript(`document.body.innerHTML.match(/loadChapterGrid\\(["'](.*)['"]/).at(1)`);
    }

    public override get Icon() {
        return icon;
    }
}