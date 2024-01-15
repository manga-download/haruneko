import { Tags } from '../Tags';
import icon from './ShonenJumpPlus.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as CoreView from './decorators/CoreView';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/episode\/\d+$/, CoreView.queryMangaTitleFromURI)
@CoreView.MangasMultiPageCSS()
@CoreView.PagesSinglePageJSON()
@CoreView.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shonenjumpplus', `少年ジャンプ＋ (Shonen Jump +)`, 'https://shonenjumpplus.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        if (/^\/magazine\/\d+$/.test(manga.Identifier)) {
            const request = new Request(new URL(manga.Identifier, this.URI).href);
            const data = await FetchCSS(request, '.episode-header-title');
            return [new Chapter(this, manga, manga.Identifier, data[0].textContent.replace(manga.Title, "").trim())];
        } else {
            return CoreView.FetchChaptersSinglePageCSS.call(this, manga);
        }
    }
}
