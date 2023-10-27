import { Tags } from '../../Tags';
import icon from './NetTruyen.webp';
import { DecoratableMangaScraper, type Manga, type MangaPlugin } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import * as Mojo from '../decorators/MojoPortalComic';

//TODO: Implement URL setting

@Common.MangasMultiPageCSS(Mojo.path, Mojo.queryMangas)
@Common.ChaptersSinglePageCSS(Mojo.queryChapter)
@Mojo.PagesSinglePageCSS([], Mojo.queryPages)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nettruyen', `NetTruyen`, 'https://www.nettruyenus.com', Tags.Language.Vietnamese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return url.includes(this.URI.origin +'/truyen-tranh/');
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        return Common.FetchMangaCSS.call(this, provider, url, 'article#item-detail h1.title-detail');
    }
}