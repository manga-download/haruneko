import { Tags } from '../Tags';
import icon from './YaoiHavenReborn.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

type JSONManga = {
    name: string,
    slug: string
};

const mangasPerPageScript = `
    let csrf_token = Cookies.get('csrftoken');
    app.$http.post('/api/accounts/pagination/', {'paginate_by': 200}, {headers: {'X-CSRFToken': csrf_token}});
`;

@Common.MangaCSS(/^{origin}\/doujinshi/, 'meta[property="og:title"]')
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageCSS('v-card-text v-img.mx-auto.my-1')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('yaoihavenreborn', `Yaoi Haven Reborn`, 'https://www.yaoihavenreborn.com/', Tags.Language.Multilingual, Tags.Media.Comic, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {

        //change to 200 manga per page
        await FetchWindowScript(new Request(new URL(`/doujinshi/`, this.URI)), mangasPerPageScript, 2000, 10000);

        const mangalist: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangalist.push(...mangas) : run = false;
        }
        return mangalist;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const data = await FetchWindowScript<JSONManga[]>(new Request(new URL(`/doujinshi/?page=${page}`, this.URI)), 'app.doujinshi');
        return data ? data.map(manga => new Manga(this, provider, '/doujinshi/' + manga.slug, manga.name.trim())) : [];
    }
}