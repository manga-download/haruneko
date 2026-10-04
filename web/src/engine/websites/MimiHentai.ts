import { Tags } from '../Tags';
import icon from './MimiHentai.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/truyen\/[^/]+$/, 'div.title p')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.grid a.group', Common.PatternLinkGenerator('/danh-sach?page={page}'), 500, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('div h1.text-white').textContent.trim()
}))
@Common.ChaptersSinglePageCSS('div.chapter-list a', undefined, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageCSS('div.text-center img.lazy')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mimihentai', 'MimiHentai', 'https://mimihentai.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Vietnamese, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}