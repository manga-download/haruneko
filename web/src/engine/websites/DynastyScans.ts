import { Tags } from '../Tags';
import icon from './DynastyScans.webp';
import { Chapter, DecoratableMangaScraper, Manga,type MangaPlugin, Page } from '../providers/MangaPlugin';
import { FetchJSON, FetchRequest } from '../FetchProvider';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^https?:\/\/dynasty-scans\.com\/[^/]+/, 'h2.tag-title b')
@Common.ImageDirect()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('dynasty-scans', `DynastyScans`, 'https://dynasty-scans.com' , Tags.Language.English, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangalist = [];
        const categories = ['/series', '/anthologies', '/issues', '/doujins'];
        for (const cat of categories) {
            const mangas = await this.getMangasFromCategory(provider, cat);
            mangas.length > 0 ? mangalist.push(...mangas) : false;
        }
        return mangalist;
    }

    async getMangasFromCategory(provider: MangaPlugin, cat: string): Promise<Manga[]> {
        const mangas = [];
        for (let i = 1, run = true; run; i++) {
            try {
                const json = await FetchJSON(new FetchRequest(new URL(`${cat}.json?page=${i}`, this.URI).href));
                run = i < json['total_pages'];

                for (const tags of json['tags']) {
                    //console.log(tags);
                    for (const name in tags) {
                        //  console.log(name + "=" + tags[name]);
                        tags[name].map(manga => mangas.push(new Manga(this, provider, `${cat}/${manga.permalink}`, manga.name)));

                    }
                }
            }
            catch (error) {
                run = false;
            }
        }
        return mangas;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const json = await FetchJSON(new FetchRequest(new URL(`${manga.Identifier}.json`, this.URI).href));
        let chapterList = json['taggings'].filter(chapter => !('header' in chapter)).map(chapter => {
            return new Chapter(this, manga, `/chapters/${chapter.permalink}`, chapter.title.trim());
        });

        //making sure chapters are unique, as written in original code its apparently needed
        chapterList = [...new Map(chapterList.map(item => [item['Identifier'], item])).values()];
        return chapterList;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const json = await FetchJSON(new FetchRequest(new URL(`${chapter.Identifier}.json`, this.URI).href));
        return json['pages'].map(page => new Page(this, chapter, new URL(page.url, this.URI)));
    }
}
