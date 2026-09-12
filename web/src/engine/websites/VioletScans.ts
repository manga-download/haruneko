import { Tags } from '../Tags';
import icon from './VioletScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/comics\/[^/]+\/$/)
@Common.MangasMultiPageCSS<HTMLAnchorElement>('a[href*="/comics/"][title]', Common.PatternLinkGenerator('/comics/page/{page}/'), 0, anchor => ({
    id: new URL(anchor.href).pathname,
    title: anchor.title.trim()
}))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('#chapterlist li a[href]', undefined, anchor => ({
    id: new URL(anchor.href).pathname,
    title: anchor.querySelector<HTMLElement>('span.chapternum').textContent.replace(/\s+/g, ' ').trim()
}))
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('violetscans', 'Violet Scans', 'https://violetscans.org', Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}
