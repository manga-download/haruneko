import { Tags } from '../Tags';
import icon from './SakuraManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/p-[^/]+\/$/, 'div#content div.archive-title')
@Common.MangasMultiPageCSS('/japanese-manga-list/?lcp_page0={page}', 'ul#lcp_instance_0 li a')
@Common.ChaptersSinglePageCSS('div.chap-list a')
@Common.PagesSinglePageCSS('div.entry-content p img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sakuramanga', `Sakura Manga`, 'https://mangasakura.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}