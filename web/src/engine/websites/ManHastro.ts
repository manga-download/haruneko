import { Tags } from '../Tags';
import icon from './ManHastro.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

@Madara.MangaCSS(/^{origin}\/lermanga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageAJAX()
@Common.PagesSinglePageJS('imageLinks.map(image => atob(image));')
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhastro', 'ManHastro', 'https://manhastro.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await Madara.FetchChaptersSinglePageCSS.call(this, manga);
        const options = await FetchCSS<HTMLOptionElement>(new Request(new URL(chapters.at(0).Identifier, this.URI)), 'select.single-chapter-select option');
        return options.map(option => new Chapter(this, manga, new URL(option.dataset.redirect, this.URI).pathname, option.textContent.trim()));
    }
}