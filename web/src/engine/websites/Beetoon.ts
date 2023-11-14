import { Tags } from '../Tags';
import icon from './Beetoon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Zbulu from './decorators/WordPressZbulu';
import { Fetch, FetchRequest } from '../FetchProvider';

@Zbulu.MangaCSS(/^https?:\/\/(ww\d*\.)?beetoon\.net\/[^/]+\/$/)
@Zbulu.MangasMultiPageCSS()
@Zbulu.ChaptersMultiPageCSS(Zbulu.chapterPath, 'div#chapterList div.items-chapters a')
@Common.PagesSinglePageCSS(Zbulu.queryPages)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('beetoon', `Beetoon`, 'https://beetoon.net', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        const response = await Fetch(new FetchRequest(this.URI.href));
        console.log(`Assigned URL ${response.url} to ${this.Title}`);
        this.URI.href = response.url;
        return;
    }

}