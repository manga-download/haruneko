import { Tags } from '../Tags';
import icon from './TKSuperheroComics.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { FetchCSS } from '../platform/FetchProvider';

function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('.rensai-episode-title').textContent.trim()
    };
}

@Common.MangaCSS(/{origin}\/rensai\/[^/]+\/$/, 'div.manga-overview-top-wrapper h2.manga-heading')
@Common.MangasSinglePagesCSS(['/rensai'], 'li.rensai-episode-list a', MangaExtractor)
@SpeedBinb.PagesSinglePageAjax()
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tksuperherocomics', `Televi-kun Superhero Comics (てれびくんスーパーヒーローコミックス)`, 'https://televikun-super-hero-comics.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await FetchCSS<HTMLAnchorElement>(new Request(new URL(manga.Identifier, this.URI)), 'section[data-start-date].manga-all-episode-section li.manga-all-episode-list a:not([href^="http"])');
        return chapters.map(chapter => new Chapter(this, manga, `${manga.Identifier}${chapter.getAttribute('href')}`, chapter.text.trim()));
    }
}