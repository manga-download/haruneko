import { Tags } from '../Tags';
import icon from './SundayWebry.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as CoreView from './decorators/CoreView';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';

type APIChapter = {
    title: string,
    viewer_uri : string
}

type JSONSerie = {
    readableProduct: {
        series: {
            id: string;
        }
    }
}

@Common.MangaCSS(/^{origin}\/episode\/\d+$/, CoreView.queryMangaTitleFromURI)
@CoreView.MangasMultiPageCSS(['/series', '/series/oneshot', '/series/yoru-sunday'], 'ul.webry-series-list > li.webry-series-item > a')
@CoreView.PagesSinglePageJSON()
@CoreView.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sundaywebry', `サンデーうぇぶり (Sunday Webry)`, 'https://www.sunday-webry.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const jsonData = (await FetchCSS(new Request(new URL(manga.Identifier, this.URI)), 'script#episode-json')).shift().dataset.value;
        const { readableProduct: { series: { id } } } = JSON.parse(jsonData) as JSONSerie;
        const chapterList : Chapter[] = [];
        for (let offset = 0, run = true; run; ) {
            const chapters = await this.GetChaptersFromOffset(manga, id, offset);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
            offset += chapters.length;
        }
        return chapterList;
    }

    private async GetChaptersFromOffset(manga: Manga, seriesId: string, offset: number) {
        const data = await FetchJSON<APIChapter[]>(new Request(new URL(`/api/viewer/pagination_readable_products?type=episode&aggregate_id=${seriesId}&sort_order=desc&offset=${offset}`, this.URI)));
        return data.map(chapter => new Chapter(this, manga, new URL(chapter.viewer_uri).pathname, chapter.title));
    }
}