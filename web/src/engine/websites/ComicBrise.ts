import { Tags } from '../Tags';
import icon from './ComicBrise.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { FetchCSS, FetchRequest } from '../FetchProvider';

@Common.MangaCSS(/^{origin}\/contents\/[^/]+\/$/, '.post-title')
@Common.MangasSinglePageCSS('/titlelist', '.list-works a')
@SpeedBinb.PagesSinglePageAjax()
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('comicbrise', `Comic-Brise`, 'https://www.comic-brise.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL(manga.Identifier, this.URI);
        const request = new FetchRequest(uri.href);
        const data = await FetchCSS(request, '.modal.modal-chapter .modal-body');
        return data.reverse()
            //.filter(e => e.querySelector(".banner-trial img").getAttribute("alt") == "FREE") //dont filter for free chapter
            .map(element => new Chapter(this, manga, element.querySelector<HTMLAnchorElement>('.banner-trial a').pathname, element.querySelector('.primary-title').textContent.trim()));
    }
}