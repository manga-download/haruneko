import { Tags } from '../Tags';
import icon from './Wnacg.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/photos-index/, 'div#bodywrap > h2')
@Common.MangasMultiPageCSS('/albums-index-page-{page}.html', 'ul li.gallary_item div.info div.title a')
@Common.ChaptersUniqueFromManga()
@Common.ImageAjaxFromHTML('img#picarea')
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('wnacg', `Wnacg`, 'https://www.wnacg.com', Tags.Language.Chinese, Tags.Media.Manga, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const element = (await FetchCSS<HTMLAnchorElement>(new Request(new URL(chapter.Identifier, this.URI)), 'ul li.gallary_item div.pic_box > a:first-of-type')).at(-1);
        const options = await FetchCSS<HTMLOptionElement>(new Request(new URL(element.pathname, this.URI)), 'div.newpage select.pageselect option');
        return options.map(option => new Page(this, chapter, new URL(`/photos-view-id-${option.value}.html`, this.URI)));
    }
}