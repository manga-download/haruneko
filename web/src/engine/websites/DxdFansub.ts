import { Tags } from '../Tags';
import icon from './DxdFansub.webp';
import { ZeistManga } from './templates/ZeistManga';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/\d+\/\d+\/[^/]+\.html$/, 'h1#post-title')
@Common.PagesSinglePageJS(`[...document.querySelectorAll('#pages img')].map(img => img.dataset.src ?? img.src);`, 750)
export default class extends ZeistManga {
    public constructor() {
        super('dxdfansub', 'DxD Fansub', 'https://www.dxdfansub.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
        this.mangaSlugScript = `document.querySelector('.chapter_get').dataset.labelchapter;`;
    }

    public override get Icon() {
        return icon;
    }
}