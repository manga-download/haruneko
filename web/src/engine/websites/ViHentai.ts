import { Tags } from '../Tags';
import icon from './ViHentai.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/truyen\/[^/]+$/, 'meta[name="twitter:image:alt"]')
@Common.MangasMultiPageCSS('div.manga-vertical div.truncate a.text-ellipsis', Common.PatternLinkGenerator('/tim-kiem?page={page}'), 500)
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('div.grid ul li a:has(span.truncate)', undefined, anchor => ({ id: anchor.pathname, title: anchor.querySelector('span.truncate').textContent.trim() }))
@Common.PagesSinglePageJS(`[...document.querySelectorAll('div.image-container img')].map(img => img.dataset.src ?? img.src);`, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('vihentai', 'Vi-Hentai', 'https://vi-hentai.moe', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Vietnamese, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}