import { Tags } from '../Tags';
import icon from './GanGanOnline.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

type NEXTDATA<T> = {
    props: {
        pageProps: {
            data: T
        }
    }
}

type APIMangas = {
    titleSections: {
        titles: {
            titleId: number,
            header: string,
        }[]
    }[]
}

type APIManga = {
    default: {
        chapters: {
            status: number,
            id: number,
            mainText: string,
            subText: string
        }[],
        titleId: number,
        titleName: string
    }
}

type APIPages = {
    pages: {
        image: {
            imageUrl: string
        },
        linkImage: {
            imageUrl: string
        }
    }[]
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ganganonline', `ガンガンONLINE (Gangan Online)`, 'https://www.ganganonline.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/title/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const data = await this.getEmbeddedJSON<APIManga>(new URL(url));
        return new Manga(this, provider, String(data.default.titleId), data.default.titleName);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        const slugs = ['/finish', '/rensai'];
        for (const slug of slugs) {
            const mangas = await this.getMangasFromPage(slug, provider);
            mangaList.push(...mangas);
        }
        return mangaList;
    }

    private async getMangasFromPage(slug: string, provider: MangaPlugin): Promise<Manga[]> {
        const uri = new URL(slug, this.URI);
        const data = await this.getEmbeddedJSON<APIMangas>(uri);
        return data.titleSections.reduce((accumulator, section) => {
            const mangas = section.titles.map(title => {
                return new Manga(this, provider, String(title.titleId), title.header);
            });
            return accumulator.concat(mangas);
        }, []);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL(`/title/${manga.Identifier}`, this.URI);
        const data = await this.getEmbeddedJSON<APIManga>(uri);
        return data.default.chapters
            .filter(chapter => {
                if (!chapter.id) {
                    return false;
                }
                if (chapter.status !== undefined && chapter.status < 4) {
                    return false;
                }
                return true;
            })
            .map(chapter => new Chapter(this, manga, String(chapter.id), chapter.mainText + (chapter.subText ? ' - ' + chapter.subText : '')));

    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL(`/title/${chapter.Parent.Identifier}/chapter/${chapter.Identifier}`, this.URI);
        const data = await this.getEmbeddedJSON<APIPages>(uri);
        return data.pages.map(page => new Page(this, chapter, new URL((page.image || page.linkImage).imageUrl, uri.href)));
    }

    async getEmbeddedJSON<T>(uri: URL) : Promise<T>{
        const request = new Request(uri.href);
        const scripts = await FetchCSS<HTMLScriptElement>(request, 'script#__NEXT_DATA__');
        const data: NEXTDATA<T> = JSON.parse(scripts[0].text);
        return data.props.pageProps.data;
    }
}