import { Tags } from '../Tags';
import icon from './Mikoroku.webp';
import { PageLinkExtractor, ZeistManga } from './templates/ZeistManga';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/\d+\/\d+\/[^/]+\.html$/, 'title', (element, uri) => ({ id: uri.pathname, title: element.textContent.split(' - Baca Komik').at(0).trim() }))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('div#chapterContainer a.chap-btn', undefined, anchor => ({ id: anchor.href, title: anchor.querySelector('.chap-num').textContent.trim() }))
@Common.PagesSinglePageCSS('div.check-box a img', PageLinkExtractor)

export default class extends ZeistManga {

    public constructor() {
        super('mikoroku', 'Mikoroku', 'https://www.mikoroku.my.id', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}