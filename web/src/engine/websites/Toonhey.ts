import { Tags } from '../Tags';
import icon from './Toonhey.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function CleanTitle(...elements: string[]) {
    return elements.filter(segment => `${segment ?? ''}`.trim()).join(' - ').replace(/\s+/g, ' ').replace(/\n+/g, '').trim();
}

@Common.MangaCSS(/^{origin}\/en\/[^/]+\/[^/]+\.html$/, 'div#titleSubWrapper h1.titCon')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.comicItemCon a', Common.PatternLinkGenerator('/en/genres?page={page}'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('img').alt.trim()
}))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('a#episodeItemCon', undefined, anchor => ({
    id: anchor.pathname,
    title: CleanTitle(anchor.querySelector<HTMLParagraphElement>('p[href]').textContent.trim(), anchor.querySelector('p.episodeStitle').textContent.split('-').at(1) ?? '')
}))
@Common.PagesSinglePageCSS('div.imgSubWrapper img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toonhey', 'Toonhey', 'https://toonhey.com', Tags.Media.Manhwa, Tags.Source.Official, Tags.Language.English, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}