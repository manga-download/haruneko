import { Tags } from '../Tags';
import icon from './LxHentai.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('span.text-ellipsis').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/truyen\/[^/]+/, 'ol li div.flex.items-center span')
@Common.MangasMultiPageCSS('div.w-full.relative div.p-2.w-full.truncate a.text-ellipsis', Common.PatternLinkGenerator('/danh-sach?page={page}'), 300)
@Common.ChaptersSinglePageCSS('div.justify-between ul.overflow-y-auto a', undefined, ChapterExtractor)
@Common.PagesSinglePageCSS('div#image-container.lazy')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lxhentai', `LxHentai (Hentai LXX)`, 'https://lxmanga.my', Tags.Language.Vietnamese, Tags.Media.Manga, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}