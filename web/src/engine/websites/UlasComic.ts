import { Tags } from '../Tags';
import icon from './UlasComic.webp';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';
import { ZeistManga } from './templates/ZeistManga';

@MangaStream.MangaCSS(/^{origin}\/\d+\/\d+\/[^.]+\.html$/)
@Common.PagesSinglePageJS(`config.chapterImage.map(image => image.replace(/\\/s\\d+[^/]*(\\/[^/]+$)/, '/s0$1'));`, 2500)
export default class extends ZeistManga {

    public constructor() {
        super('ulascomic', 'Ulas Comic', 'https://www.ulascomic00.xyz', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Indonesian, Tags.Source.Scanlator);
        this.mangaSlugScript = `document.querySelector('#chapterlist').dataset.postTitle.trim();`;
    }

    public override get Icon() {
        return icon;
    }
}