import { Tags } from '../Tags';
import icon from './Jjaptoon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS<HTMLImageElement>(/^{origin}\/comics\/\d+$/, 'img.object-cover.h-full:not([alt=""])', (el, uri) => ({
    id: uri.pathname,
    title: el.alt.trim()
}))
@Common.MangasMultiPageCSS<HTMLAnchorElement>('section div.grid a.group', Common.PatternLinkGenerator('/?selectedType=all&comicsPage={page}'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('h2').textContent.trim()
}))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('section div.overflow-hidden a', undefined, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('p.truncate').textContent.trim()
}))
@Common.PagesSinglePageCSS('div.flex img.select-none')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('jjaptoon', 'Jjaptoon', 'https://www.jjaptoon003.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Korean, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}