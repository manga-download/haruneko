import { Tags } from '../Tags';
import icon from './Beetoon.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Zbulu from './decorators/WordPressZbulu';
import { Fetch } from '../platform/FetchProvider';
import DeProxify from '../transformers/ImageLinkDeProxifier';

@Zbulu.MangaCSS(/^https?:\/\/(ww\d*\.)?beetoon\.net\/[^/]+\/$/)
@Zbulu.MangasMultiPageCSS()
@Zbulu.ChaptersMultiPageCSS(Zbulu.chapterPath, 'div#chapterList div.items-chapters a')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('beetoon', `Beetoon`, 'https://beetoon.net', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        const response = await Fetch(new Request(this.URI));
        console.log(`Assigned URL ${response.url} to ${this.Title}`);
        this.URI.href = response.url;
        return;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages = await Common.FetchPagesSinglePageCSS.call(this, chapter, Zbulu.queryPages);
        return pages.map(page => {
            let link : URL | undefined = undefined;
            try {
                link = DeProxify(page.Link); //try to get pic url in case of legitimate Google Proxy uses
            } catch (error) {
                //in case of fake page we end up here
            }
            return new Page(this, chapter, link, { Referer: this.URI.origin });
        }).filter(page => page.Link);
    }

}