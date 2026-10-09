import { Tags } from '../Tags';
import icon from './TKSuperheroComics.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';

@Common.MangaCSS(/{origin}\/rensai\/[^/]+\/$/, 'div.manga-overview-top-wrapper h2.manga-heading')
@Common.MangasSinglePageCSS<HTMLAnchorElement>('/rensai', 'li.rensai-episode-list a', anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('.rensai-episode-title').textContent.trim()
}))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('section[data-start-date].manga-all-episode-section li.manga-all-episode-list a:not([href^="http"])', undefined, (anchor, uri) => ({
    id: new URL(anchor.getAttribute('href'), uri).pathname,
    title: anchor.textContent.trim()
}))
@SpeedBinb.PagesSinglePageAjax()
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tksuperherocomics', `Televi-kun Superhero Comics (てれびくんスーパーヒーローコミックス)`, 'https://televikun-super-hero-comics.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}