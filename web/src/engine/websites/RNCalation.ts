import { Tags } from '../Tags';
import icon from './RNCalation.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/comics\/[^/]+$/, 'title')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('a.comic-card', Common.PatternLinkGenerator('/library?page={page}'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('p.leading-snug').textContent.trim()
}))
@Common.ChaptersMultiPageCSS<HTMLAnchorElement>('a', Common.PatternLinkGenerator('{id}/chapters?page={page}'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.dataset.chapterLabel
}))
@Common.PagesSinglePageCSS<HTMLImageElement>('div.page-img-wrap img.page-img', img => img.dataset.fbWp || img.dataset.src || img.src)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('traduccionesamistosas', 'RNCalation', 'https://rncalation.online', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('age_verified', '1')`);
    }
}