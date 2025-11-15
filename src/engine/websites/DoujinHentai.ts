import { Tags } from '../Tags';
import icon from './DoujinHentai.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga-hentai\/[^/]+$/, 'div.post-content meta[itemprop="itemreviewed"]')
@Madara.PagesSinglePageCSS('div#all img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('doujinhentai', 'DoujinHentai', 'https://doujinhentai.net', Tags.Media.Manga, Tags.Language.Spanish, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangas = await Madara.FetchMangasMultiPageCSS.call(this, provider, 'div.page-content-listing > div > a.thumbnail', 0, '/lista-manga-hentai?page={page}');
        return mangas.map(manga => {
            const title = manga.Title.replace(/^\s*[Ll]eer/, '').replace(/[Oo]nline\s*$/, '').trim();
            return new Manga(this, provider, manga.Identifier, title);
        });
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await Madara.FetchChaptersSinglePageCSS.call(this, manga);
        return chapters.map(chapter => {
            const title = chapter.Title.replace(/^\s*[Ll]eer\s*([Cc]omic|[Dd]oujin|[Gg]aleria|[Mm]anga)\s*/, '').trim();
            return new Chapter(this, manga, chapter.Identifier, title);
        });
    }
}