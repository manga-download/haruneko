import { Tags } from '../Tags';
import icon from './PlotTwistNoFansub.webp';
import { Chapter, DecoratableMangaScraper, type MangaPlugin, Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type APISearchResult = {
    td_data: string
}

type APIChapter = {
    post_name: string,
    chapter_number: string,
    chapter_name: string
}

const pageScript = `
    new Promise(resolve => {
        resolve(objetoglobal.images.map(image => {
            return objetoglobal.image_url + "/" + objetoglobal.title + "_" + objetoglobal.images[0].manga_id + "/ch_" + parseFloat(document.querySelector("select#chapter-select").value) + "/" + image.image_name;
        }));
    });
`;

@Common.MangaCSS(/^{origin}\/plotwist\/manga\/[^/]+\/$/, 'p.htilestiloso')
@Common.PagesSinglePageJS(pageScript, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('plottwistnofansub', 'Plot Twist No Fansub', 'https://plotnf.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (const letter of 'aeiouy'.split('')) {
            const mangas = await this.GetMangasFromLetter(provider, letter);
            mangaList.push(...mangas);
        }
        return mangaList.distinct();
    }

    private async GetMangasFromLetter(provider: MangaPlugin, letter: string): Promise<Manga[]> {
        const uri = new URL('/wp-admin/admin-ajax.php', this.URI);
        const { td_data } = await FetchJSON<APISearchResult>(new Request(uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: new URLSearchParams({
                action: 'td_ajax_search',
                module: 'tdb_module_search',
                td_string: letter,
                limit: '9999'
            }).toString()
        }));

        const doc = new DOMParser().parseFromString(td_data, 'text/html');
        return [...doc.querySelectorAll<HTMLAnchorElement>('.entry-title a[href*="/plotwist/manga/"]')].map(manga => {
            const { id, title } = Common.AnchorInfoExtractor(true).call(this, manga, uri);
            return new Manga(this, provider, id, title);
        });
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaId = await FetchWindowScript<string>(new Request(new URL(manga.Identifier, this.URI)), 'obj.manid');
        const chapterList: Chapter[] = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page, mangaId);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList.distinct();
    }

    private async GetChaptersFromPage(manga: Manga, page: number, mangaId: string): Promise<Chapter[]> {
        const data = await FetchJSON<APIChapter[]>(new Request(new URL('/wp-admin/admin-ajax.php', this.URI), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: new URLSearchParams({
                manga_id: mangaId,
                action: 'lcapl6',
                pageNumber: page.toString()
            }).toString()
        }));
        return data.map(chapter => {
            const title = new DOMParser().parseFromString(`Cap&iacute;tulo ${chapter.chapter_number}: ${chapter.chapter_name}`, 'text/html').body.innerText.trim();
            return new Chapter(this, manga, `/reader/${chapter.post_name}/chapter-${chapter.chapter_number}/`, title);
        });
    }
}