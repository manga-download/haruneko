import { Tags } from '../Tags';
import icon from './MichiKusa.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';

@Common.MangaCSS(/^{origin}\/product\/[^/]+$/, 'header.entry-header h1.page-title')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.entry-content', Common.PatternLinkGenerator('/product/page/{page}'), 0,
    element => ({
        id: element.querySelector<HTMLAnchorElement>('a').pathname,
        title: element.querySelector<HTMLDivElement>('div.contents-info div.title').textContent.trim()
    }))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('div.released_episodes div.items div.item a', undefined,
    anchor => ({
        id: anchor.pathname.replace(/index\.html$/, ''),
        title: anchor.text.trim()
    }))
@SpeedBinb.PagesSinglePageAjax()
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('michikusa', `MichiKusa`, 'https://michikusacomics.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}