import { Tags } from '../Tags';
import icon from './DoujinZa.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

type MangaID = {
    post: string,
    slug: string
}

@Madara.MangaCSS(/^{origin}\/doujin\/[^/]+\/$/, 'div.post-title h1')
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('doujinza', 'DoujinZa', 'https://doujinza.com', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Thai, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangas = await Madara.FetchMangasMultiPageCSS.call(this, provider);
        return mangas.filter(manga => {
            const mangaID: MangaID = JSON.parse(manga.Identifier);
            return mangaID.slug !== '/'; //some manga links are bugged, cant help it
        }).map(manga => {
            const mangaID: MangaID = JSON.parse(manga.Identifier);
            const link = mangaID.slug.match(/(^\/doujin\/[^/]+\/)/)[1]; //some mangas are direct links to the only chapter, so we keep only manga part
            mangaID.slug = link;
            return new Manga(this, provider, JSON.stringify(mangaID), manga.Title);
        });
    }
}