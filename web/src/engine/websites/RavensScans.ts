// Based on the outdated ReaderFront Template (https://github.com/dvaJi/ReaderFront)
import { Tags } from '../Tags';
import icon from './RavensScans.webp';
import { FetchGraphQL } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const LanguageMap = new Map([
    [ 'en', { id: 2, tag: Tags.Language.English } ],
    [ 'es', { id: 1, tag: Tags.Language.Spanish } ],
]);

type GQLManga = {
    work: {
        id: number;
        name: string;
        language_name: string;
    };
};

type GQLMangas = {
    works: GQLManga[ 'work' ][];
};

type GQLChapters = {
    chaptersByWorkId: {
        id: number;
        volume: number;
        chapter: number;
        subchapter: number;
        name: string;
    }[];
};

type GQLPages = {
    chapterById: {
        uniqid: string;
        work: { uniqid: string; };
        pages: { filename: string; }[];
    };
};

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://api.ravens-scans.com';
    private readonly cdnURL = 'https://img-cdn1.ravens-scans.com';

    public constructor () {
        super('ravensscans', `Ravens Scans`, 'https://ravens-scans.com', Tags.Media.Manga, Tags.Language.Spanish, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/work/[a-z]{2}/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const [ , , lang, stub ] = new URL(url).pathname.split('/');
        const { work: { id, name } } = await FetchGraphQL<GQLManga>(new Request(this.apiURL), undefined, `
            query ($stub: String, $language: Int) {
                work(stub: $stub, language: $language, showHidden: true) { id, name, language_name }
            }
        `, { stub, language: LanguageMap.get(lang).id });
        return new Manga(this, provider, `${id}`, `${name.trim()} [${lang}]`, LanguageMap.get(lang).tag);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { works: mangas } = await FetchGraphQL<GQLMangas>(new Request(this.apiURL), undefined, `
            query {
                works(sortBy: "name", orderBy: "ASC", first: 500, offset: 0, showHidden: true) {
                    id, name, language_name
                }
            }
        `, {});
        return mangas.map(({ id, name, language_name: lang }) => {
            return new Manga(this, provider, `${id}`, `${name} [${lang}]`, LanguageMap.get(lang).tag);
        });
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chaptersByWorkId: chapters } = await FetchGraphQL<GQLChapters>(new Request(this.apiURL), undefined, `
            query ($id: Int) {
                chaptersByWorkId(workId: $id) { id, volume, chapter, subchapter, name }
            }
        `, { id: parseInt(manga.Identifier) });
        return chapters.map(({ id, volume, chapter, subchapter, name }) => {
            const title = [
                volume > 0 ? `Vol. ${volume}` : '',
                `Ch. ${chapter}${subchapter > 0 ? '.' + subchapter : ''}`,
                name ? `- ${name}` : '',
            ].join(' ').trim();
            return new Chapter(this, manga, `${id}`, title);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { chapterById: { uniqid: chapterUID, work: { uniqid: mangaUID }, pages } } = await FetchGraphQL<GQLPages>(new Request(this.apiURL), undefined, `
            query($id: Int) {
                chapterById(id: $id, showHidden: true) {
                    work { uniqid }, uniqid, pages { filename }
                }
            }
        `, { id: parseInt(chapter.Identifier) });
        return pages.map(({ filename }) => {
            const uri = new URL([ '/works', mangaUID, chapterUID, filename ].join('/'), this.cdnURL);
            return new Page(this, chapter, uri);
        });
    }
}