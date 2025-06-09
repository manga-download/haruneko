import { Tags } from '../Tags';
import icon from './ShonenMagazine.webp';
import CiaoPlus, { DRMProvider, type MangaData } from './CiaoPlus';

// TODO: Revision

type APIManga = {
    web_title: {
        title_id: number,
        episode_id_list: number[],
        title_name: string
    }
}

export default class extends CiaoPlus {

    protected override readonly drm = new DRMProvider('https://api.pocket.shonenmagazine.com/', {
        name: 'X-Manga-Hash',
        seed: [ // SHA256('') + '_' + SHA512('')
            'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e',
        ].join('_')
    });

    public constructor() {
        super('shonenmagazine', '週刊少年マガジ (Weekly Shonen Magazine & Pocket Magazine)', 'https://pocket.shonenmagazine.com', [Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga]);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/title/\\d+/episode/\\d+$`).test(url);
    }

    protected override async GetMangaDatas(mangaId: string): Promise<MangaData> {
        const { web_title: { episode_id_list, title_id, title_name } } = await this.drm.FetchAPI<APIManga>('./web/title/detail', {
            platform: '3',
            title_id: mangaId,
        });
        return {
            id: title_id.toString(),
            title: title_name.trim(),
            episode_list: episode_id_list
        };
    }
}