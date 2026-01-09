import { Tags } from '../Tags';
import icon from './GanGanOnline.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

type NEXTDATA<T> = {
    props: {
        pageProps: {
            data: T;
        }
    }
};

type APIMangas = {
    titleSections: {
        titles: {
            titleId: number;
            header: string;
        }[];
    }[];
};

type APIManga = {
    default: {
        chapters: {
            status: number;
            id: number;
            mainText: string;
            subText: string;
        }[];
        titleId: number;
        titleName: string;
    }
};

type APIPages = {
    pages: {
        image: {
            imageUrl: string;
        },
        linkImage: {
            imageUrl: string;
        }
    }[];
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ganganonline', `ガンガンONLINE (Gangan Online)`, 'https://www.ganganonline.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/title/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { default: { titleId, titleName } } = await this.GetEmbeddedJSON<APIManga>(new URL(url));
        return new Manga(this, provider, `${titleId}`, titleName);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        const slugs = ['/finish', '/rensai'];
        for (const slug of slugs) {
            const mangas = await this.GetMangasFromPage(slug, provider);
            mangaList.push(...mangas);
        }
        return mangaList;
    }

    private async GetMangasFromPage(slug: string, provider: MangaPlugin): Promise<Manga[]> {
        const uri = new URL(slug, this.URI);
        const { titleSections } = await this.GetEmbeddedJSON<APIMangas>(uri);
        return titleSections.reduce((accumulator, section) => {
            const mangas = section.titles.map(title => {
                return new Manga(this, provider, String(title.titleId), title.header);
            });
            return accumulator.concat(mangas);
        }, []);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { default: { chapters } } = await this.GetEmbeddedJSON<APIManga>(new URL(`/title/${manga.Identifier}`, this.URI));
        return chapters
            .filter(({ id, status }) => {
                if (!id) {
                    return false;
                }
                if (status !== undefined && status < 4) {
                    return false;
                }
                return true;
            })
            .map(({ id, mainText, subText }) => new Chapter(this, manga, `${ id }`, mainText + (subText ? ' - ' + subText : '')));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL(`/title/${chapter.Parent.Identifier}/chapter/${chapter.Identifier}`, this.URI);
        const { pages } = await this.GetEmbeddedJSON<APIPages>(uri);
        return pages.map(({ image, linkImage }) => new Page(this, chapter, new URL((image || linkImage).imageUrl, uri)));
    }

    private async GetEmbeddedJSON<T>(uri: URL) : Promise<T> {
        const [script] = await FetchCSS<HTMLScriptElement>(new Request(uri), 'script#__NEXT_DATA__');
        return (JSON.parse(script.text) as NEXTDATA<T>).props.pageProps.data;
    }
}