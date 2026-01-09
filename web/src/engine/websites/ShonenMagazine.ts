import { Tags } from '../Tags';
import icon from './ShonenMagazine.webp';
import { type MangaPlugin, Manga, type Chapter } from '../providers/MangaPlugin';
import CiaoPlus, { DRMProvider } from './CiaoPlus';

type APIManga = {
    web_title: {
        title_id: number;
        title_name: string;
        episode_id_list: number[];
    };
};

// TODO: Check for possible revision

// TODO: Integration => https://github.com/manga-download/haruneko/commit/72a42dc5b3615af0c01588bc1c8d4db14a36a799#diff-0f4fdeca648eb4546349d45ef81d6abca1844a3dc84b0863ce3073832853792a
export default class extends CiaoPlus {

    protected override readonly drm = new DRMProvider('https://api.pocket.shonenmagazine.com/', {
        name: 'X-Manga-Hash',
        seed: [
            'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', // SHA256('')
            'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e', // SHA512('')
        ].join('_'),
    }, {
        headers: {
            'x-manga-is-crawler': 'false',
            'x-manga-platform': '3'
        }
    });

    public constructor() {
        super('shonenmagazine', '週刊少年マガジ (Weekly Shonen Magazine & Pocket Magazine)', 'https://pocket.shonenmagazine.com', [Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official]);
    }

    public override get Icon() {
        return icon;
    }

    async #FetchMangaInfo(mangaID: string): Promise<APIManga> {
        return this.drm.FetchAPI<APIManga>('./web/title/detail', {
            title_id: mangaID,
        });
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/title/\\d+/.*`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { web_title: { title_id, title_name } } = await this.#FetchMangaInfo(new URL(url).pathname.split('/').at(2));
        return new Manga(this, provider, title_id.toString(), title_name.trim());
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { web_title: { episode_id_list } } = await this.#FetchMangaInfo(manga.Identifier);
        return this.FetchChapterList(manga, episode_id_list);
    }
}