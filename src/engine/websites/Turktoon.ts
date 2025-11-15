import { Tags } from '../Tags';
import icon from './Turktoon.webp';
import * as Common from './decorators/Common';
import { ZeistManga } from './templates/ZeistManga';

@Common.MangaCSS(/^{origin}\/\d+\/\d+\/[^/]+\.html$/, 'h1#post-title')
@Common.PagesSinglePageCSS('div.i_img img')
export default class extends ZeistManga {

    public constructor() {
        super('turktoon', 'Turktoon', 'https://www.turktoon.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Aggregator);
        this.mangaEntriesSlug = 'Seri';
        this.mangaSlugScript = 'document.querySelector("[data-labelchapter]").dataset.labelchapter;';
    }

    public override get Icon() {
        return icon;
    }
}