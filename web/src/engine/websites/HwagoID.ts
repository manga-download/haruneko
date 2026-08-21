import { Tags } from '../Tags';
import icon from './HwagoID.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS<HTMLMetaElement>(/^{origin}\/comic\/[^/]+$/, 'meta[property="og:title"]', (meta, uri) => ({
    id: uri.pathname,
    title: meta.content.split('|').at(0).trim()
}))
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div#browse-grid-view div.grid div.group div a', Common.PatternLinkGenerator('/browse?page={page}'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('h3').textContent.trim()
}))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('div#tab-chapters a', undefined, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('span').textContent.trim()
}))
@Common.PagesSinglePageCSS('div#reader-pages div img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hwagoid', 'Hwago', 'https://02.hwago.xyz', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}