import { Tags } from '../../Tags';
import icon from './ComicZerosum.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../../providers/MangaPlugin';
import * as SpeedBind from '../decorators/SpeedBind';
import { FetchJSON, FetchRequest } from '../../FetchProvider';

type MangaJson = {
    Work: {
        Name: string,
        Tag: string;
        Stories?: {
            Url: string,
            Name: string
        }[]
    }
}

type MangaList = {
    Stories: {
        Work: {
            Name: string,
            Tag : string
        }
    }[]
}

@SpeedBind.PagesSinglePage()
@SpeedBind.ImageDescrambler()
export default class extends DecoratableMangaScraper {
    private readonly data_url = 'https://zerosumonline.com/json/zerosum/';
    public constructor() {
        super('comiczerosum', `Comic ゼロサム (Comic ZEROSUM)`, 'https://zerosumonline.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string) : boolean {
        return /^https?:\/\/zerosumonline\.com\/zerosum\/comic\/[^/]+$/.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string) : Promise<Manga> {
        const id = url.match(/\/zerosum\/comic\/([^/]+)$/)[1];
        const request = new FetchRequest(`${this.data_url}/works/${id}.json`);
        const data: MangaJson = await FetchJSON(request);
        return new Manga(this, provider, id, data.Work.Name);

    }

    public override async FetchMangas(provider : MangaPlugin): Promise<Manga[]> {
        const request = new FetchRequest(`${this.data_url}/list/name.json`);
        const data: MangaList = await FetchJSON(request);
        return data.Stories.map(story => new Manga(this, provider, story.Work.Tag, story.Work.Name));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new FetchRequest(`${this.data_url}/works/${manga.Identifier}.json`);
        const data: MangaJson = await FetchJSON(request);
        return data.Work.Stories.map(story => new Chapter(this, manga, story.Url, story.Name));
    }
}