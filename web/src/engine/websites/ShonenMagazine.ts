import { Tags } from '../Tags';
import icon from './ShonenMagazine.webp';
import { FetchJSON } from '../platform/FetchProvider';
import CiaoPlus, { type MangaData } from './CiaoPlus';

type APIManga = {
    web_title: {
        title_id: number,
        episode_id_list: number[],
        title_name: string
    }
}

export default class extends CiaoPlus {
    public constructor() {
        //Shonenmagazine.com && pocket.shonenmagazine.com mangas url starts with https://pocket.shonenmagazine.com so this plugin handles both.
        super('shonenmagazine', `週刊少年マガジ (Weekly Shonen Magazine & Pocket Magazine)`, 'https://pocket.shonenmagazine.com', [Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga]);
        this.apiUrl = 'https://api.pocket.shonenmagazine.com/';
        this.requestHashProperty = 'x-manga-hash';
        this.pieceScale = 32;
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.requestHashAppend = await this.DoubleSHA('', '');
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/title/\\d+/episode/\\d+$`).test(url);
    }

    protected override async GetMangaDatas(mangaId: string): Promise<MangaData> {
        const request = await super.CreateRequest(`./web/title/detail?platform=3&title_id=${mangaId}`);
        const { web_title: { episode_id_list, title_id, title_name } } = await FetchJSON<APIManga>(request);
        return {
            id: title_id.toString(),
            title: title_name.trim(),
            episode_list: episode_id_list
        };
    }
}