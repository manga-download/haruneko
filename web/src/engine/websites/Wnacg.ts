import { Tags } from '../Tags';
import icon from './Wnacg.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchRequest } from '../FetchProvider';

@Common.MangaCSS(/^https?:\/\/www\.wnacg\.org\/photos-index/, 'div#bodywrap > h2')
@Common.MangasMultiPageCSS('/albums-index-page-{page}.html', 'ul li.gallary_item div.info div.title a')
@Common.ChaptersUniqueFromManga()
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('wnacg', `Wnacg`, 'https://www.wnacg.org', Tags.Language.Chinese, Tags.Media.Manga, Tags.Source.Aggregator, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pageList = [];
        //get first "image" page
        const url = new URL(chapter.Identifier, this.URI);
        let request = new FetchRequest(url.href);
        const firstlink = (await FetchCSS<HTMLAnchorElement>(request, 'ul li.gallary_item div.pic_box > a:first-of-type')).pop();

        //fetch option values
        request = new FetchRequest(new URL(firstlink.pathname, this.URI).href);
        const options = await FetchCSS<HTMLOptionElement>(request, 'div.newpage select.pageselect option');
        const linkList = options.map(op => new URL(`/photos-view-id-${op.value}.html`, this.URI).href);

        for (const link of linkList) {
            const pages = await this.ExtractPagesFromPage(chapter, link);
            pageList.push(...pages);
        }
        return pageList;
    }

    private async ExtractPagesFromPage(chapter: Chapter, url: string): Promise<Page[]> {
        const data = await FetchCSS<HTMLImageElement>(new FetchRequest(url), 'img#picarea');
        return data.map(img => new Page(this, chapter, new URL(img.src)));
    }

}