import { Tags } from '../Tags';
import icon from './GanGanOnline.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchNextProps } from '../platform/FetchProvider';

type APIWrapper<T> = {
    data: T;
};

type APIManga = APIWrapper<{
    default: {
        titleId: number;
        titleName: string;
    };
}>;

type APIMangas = APIWrapper<{
    titleSections: {
        titles: {
            titleId: number;
            header: string;
        }[];
    }[];
}>;

type APIChapters = APIWrapper<{
    default: {
        chapters: {
            id: number;
            status: number;
            mainText: string;
            subText: string;
        }[];
    };
}>;

type APIPages = APIWrapper<{
    pages: {
        image: {
            imageUrl: string;
        },
        linkImage: {
            imageUrl: string;
        };
    }[];
}>;

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
        const { data: { default: { titleId, titleName } } } = await FetchNextProps<APIManga>(new Request(new URL(url)));
        return new Manga(this, provider, `${titleId}`, titleName);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (const slug of ['/finish', '/rensai']) {
                const { data: { titleSections } } = await FetchNextProps<APIMangas>(new Request(new URL(slug, this.URI)));
                const mangasSection = titleSections.reduce((accumulator, section) => {
                    const mangas = section.titles.map(({ titleId, header }) => {
                        return new Manga(this, provider, `${titleId}`, header);
                    });
                    return accumulator.concat(mangas);
                }, []);
                yield* mangasSection;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { default: { chapters } } } = await FetchNextProps<APIChapters>(new Request(new URL(`/title/${manga.Identifier}`, this.URI)));
        return chapters
            .filter(({ id, status }) => id && (status === undefined || status > 3))
            .map(({ id, mainText, subText }) => new Chapter(this, manga, `${ id }`, mainText + (subText ? ' - ' + subText : '')));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL(`/title/${chapter.Parent.Identifier}/chapter/${chapter.Identifier}`, this.URI);
        const { data: { pages } } = await FetchNextProps<APIPages>(new Request(uri));
        return pages.map(({ image, linkImage }) => new Page(this, chapter, new URL((image || linkImage).imageUrl, uri)));
    }
}