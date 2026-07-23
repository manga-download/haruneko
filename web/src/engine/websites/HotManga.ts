import { Tags } from '../Tags';
import icon from './HotManga.webp';
import { type MangaPlugin, Manga } from '../providers/MangaPlugin';
import { MeianBase } from './templates/MeianBase';
import * as Common from './decorators/Common';

type APISerie = {
    produit: {
        ref: number;
        titre: string;
    }
};

type APISeries = {
    produits: APISerie['produit'][];
};

@Common.ChaptersUniqueFromManga()
export default class extends MeianBase {

    public constructor() {
        super('hotmanga', 'Hot-Manga', 'https://www.hot-manga.fr', Tags.Media.Manga, Tags.Language.French, Tags.Source.Official, Tags.Rating.Pornographic);
        this.WithApiURL('https://api.hot-manga.fr/v1/').WithTokenCookieName('token_hm').WithImageCDN('https://ebook.hot-manga.fr/');
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/produit/[^/]+/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { produit: { ref, titre } } = await this.FetchAPI<APISerie>(`./produit/?id=${url.split('/').at(-1)}`);
        return new Manga(this, provider, `${ref}`, titre);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 0, run = true; run ; page++) {
                const { produits } = await this.FetchAPI<APISeries>(`./catalogue/?type=manga&pageSize=96&pageIndex=${page}&ebook=true`);
                const mangas = produits.map(({ ref, titre }) => new Manga(this, provider, `${ref}`, titre));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }
}