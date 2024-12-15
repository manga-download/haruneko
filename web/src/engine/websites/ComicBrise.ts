import { Tags } from '../Tags';
import icon from './ComicBrise.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { FetchCSS } from '../platform/FetchProvider';
import { SpeedBindVersion } from './decorators/SpeedBinb';

@Common.MangaCSS(/^{origin}\/contents\/[^/]+\/$/, '.post-title')
@Common.MangasSinglePagesCSS(['/titlelist'], '.list-works a')
@SpeedBinb.PagesSinglePageAjax(SpeedBindVersion.v016061)
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('comicbrise', `Comic-Brise`, 'https://www.comic-brise.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return (await FetchCSS(new Request(new URL(manga.Identifier, this.URI)), '.modal.modal-chapter .modal-body'))
            .reverse()
            //.filter(e => e.querySelector(".banner-trial img").getAttribute("alt") == "FREE") //dont filter for free chapter
            .map(element => new Chapter(this, manga, element.querySelector<HTMLAnchorElement>('.banner-trial a').pathname, element.querySelector('.primary-title').textContent.trim()));
    }
}