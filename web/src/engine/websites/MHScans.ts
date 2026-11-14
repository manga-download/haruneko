import { Tags } from '../Tags';
import icon from './MHScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/comics\/[^/]+$/, 'div.comic-hero__head > h1')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.lib-grid a.comic-card', Common.PatternLinkGenerator('/library?page={page}'), 2000, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('p.font-semibold.leading-snug').textContent.trim()
}))
@Common.ChaptersMultiPageCSS<HTMLAnchorElement>('a[data-chapter-id]', Common.PatternLinkGenerator('{id}/chapters?page={page}'), 500, anchor => ({
    id: anchor.pathname,
    title: anchor.dataset.chapterLabel.trim()
}))
@Common.PagesSinglePageCSS('div.page-img-wrap img.page-img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mhscans', 'MHScans', 'https://mhscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}