import { Tags } from '../Tags';
import icon from './SManga.webp';
import { Chapter, DecoratableMangaScraper, type MangaPlugin, Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { FetchWindowScript } from '../platform/FetchProvider';
import { SBVersion } from './decorators/SpeedBinb';

type SSD = {
    datas?: [{
        series_data: {
            series_name: string,
            series_id: number
        }
    }],
    data?: {
        item_datas?: [{
            ssid: number,
            isbn: string,
            item_name: string
        }]
    }
}

@Common.MangasNotSupported()
@SpeedBinb.PagesSinglePageAjax(SBVersion.v016130)
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('smanga', `S-Manga`, 'https://www.s-manga.net', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
    public override ValidateMangaURL(url: string): boolean {
        return /https:\/\/www\.s-manga\.net\/items\/contents.html\?isbn=/.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { datas } = await FetchWindowScript<SSD>(new Request(url), 'window.ssd', 2000);
        return new Manga(this, provider, datas[0].series_data.series_id.toString(), datas[0].series_data.series_name.trim());
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const url = new URL(`/search/search.html?seriesid=${manga.Identifier}&order=1`, this.URI);
        const { data: { item_datas } } = await FetchWindowScript<SSD>(new Request(url), 'window.ssd', 2000);
        return item_datas.map(chapter => new Chapter(this, manga, `/reader/main.php?cid=${this.IsbnToCid(chapter.isbn)}`, chapter.item_name.replace(manga.Title, '').trim().replace(/^／/, '').trim()));
    }

    private IsbnToCid(isbn: string): string {
        return isbn.replaceAll('-', '');
    }
}