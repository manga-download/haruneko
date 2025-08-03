import { Tags } from '../Tags';
import icon from './ManHastro.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

@Madara.MangaCSS(/^{origin}\/lermanga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageAJAX()
@Common.PagesSinglePageJS('imageLinks.map( image => atob(image));')
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhastro', 'ManHastro', 'https://manhastro.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        //manga page only got 6 chapters but each chapter page got the full chapter list
        const chapters = await Madara.FetchChaptersSinglePageCSS.call(this, manga);
        const elements = await FetchCSS<HTMLOptionElement>(new Request(new URL(chapters[Math.floor(Math.random() * chapters.length)].Identifier, this.URI)), 'select.single-chapter-select option');
        return elements.map(element => new Chapter(this, manga, new URL(element.dataset.redirect).pathname, element.textContent.trim()));
    }
}