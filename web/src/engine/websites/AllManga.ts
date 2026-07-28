import { Tags } from '../Tags';
import icon from './AllManga.webp';
import { Delay } from '../BackgroundTimers';
import { FetchGraphQL, FetchWindowPreloadScript, FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { RandomText } from '../Random';

const primaryDomain = 'mkissa.to';
const patternAliasDomains = [
    primaryDomain,
    'allmanga.to'
].join('|').replaceAll('.', '\\.');

type APIManga = {
    manga: {
        _id: string;
        name: string;
        englishName: string | null;
    };
};

type APIMangas = {
    mangas: {
        edges: APIManga['manga'][];
    };
};

type ChapterID = {
    chapterString: string;
    translationType: 'raw' | 'sub';
};

type APIChapters = {
    episodeInfos: {
        episodeIdNum: number;
        uploadDates: Record<ChapterID['translationType'], string>;
        notes?: string;
    }[];
};

type APIPages = {
    chapterPages: {
        edges: [{
            pictureUrlHead: string;
            pictureUrls: {
                url: string;
            }[];
        }];
    };
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://api.mkissa.net/api';

    public constructor() {
        super('allmanga', 'AllManga', 'https://mkissa.to', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(new URL('/manga/-', this.URI)), '');
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^https?://(${patternAliasDomains})/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { manga: { _id, name, englishName } } = await FetchGraphQL<APIManga>(new Request(this.apiURL), '', `
            query ($id: String!) {
                manga(_id: $id) { _id, name, englishName }
            }
        `, { id: new URL(url).pathname.split('/').at(-1) });
        return new Manga(this, provider, _id, englishName ?? name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        // TODO: Use Array.fromAsync
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            await Delay(500);
            const mangas = await this.GetMangasFromPage(page, provider);
            mangaList.isMissingLastItemFrom(mangas) ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const { mangas: { edges } } = await FetchGraphQL<APIMangas>(new Request(this.apiURL), '', `
            query ($page: Int) {
                mangas(page: $page, format: ALL, countryOrigin: ALL, search: { allowAdult: true }) {
                    edges { _id, name, englishName }
                }
            }
        `, { page: page });
        return edges.map(({ _id, englishName, name }) => new Manga(this, provider, _id, englishName ?? name));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { episodeInfos } = await FetchGraphQL<APIChapters>(new Request(this.apiURL), '', `
            query ($showId: String!) {
                episodeInfos(showId: $showId, episodeNumStart: 0, episodeNumEnd: 9999) {
                    episodeIdNum, uploadDates, notes
                }
            }
        `, { showId: `manga@${manga.Identifier}` });

        return episodeInfos
            .toSorted((self, other) => other.episodeIdNum - self.episodeIdNum)
            .reduce((aggregator: Chapter[], { episodeIdNum, notes, uploadDates }) => {
                const chapters = Object.keys(uploadDates).map(translationType => {
                    const chapterString = `${episodeIdNum}`;
                    const title = [
                        'Chapter',
                        episodeIdNum,
                        notes && `- ${notes}`,
                        translationType === 'raw' ? '[raw]' : null,
                    ].joinTitleSegments();
                    return new Chapter(this, manga, JSON.stringify(<ChapterID>{ chapterString, translationType }), title);
                });
                return [...aggregator, ...chapters];
            }, []);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { chapterString, translationType } = <ChapterID>JSON.parse(chapter.Identifier);
        const chapterURL = new URL(`./manga/${chapter.Parent.Identifier}/chapter-${chapterString}-${translationType}`, this.URI);

        const eventName = RandomText(Math.random() * 8 + 8);
        const { chapterPages: { edges: [{ pictureUrlHead, pictureUrls }] } } = await FetchWindowPreloadScript<APIPages>(new Request(chapterURL), `
                (function () {
                    const originalJson = Response.prototype.json;
                    Response.prototype.json = function() {
                        return originalJson.call(this).then(data => {
                            if (data && data.chapterPages) {
                                setInterval(() => window.dispatchEvent(new CustomEvent('${eventName}', { detail: data })), 250);
                            }
                            return data;
                        });
                    };

                    JSON.parse = new Proxy(JSON.parse, {
                        apply(target, thisArg, args) {
                            const result = Reflect.apply(target, thisArg, args);
                            if (result && result.chapterPages) {
                                setInterval(() => window.dispatchEvent(new CustomEvent('${eventName}', { detail: result })), 250);
                            }
                            return result;
                        }
                    });
                })();
            `, `
            new Promise(resolve => {
                window.addEventListener('${eventName}', event => resolve(event.detail), { once: true });
            });
        `);

        let origin = pictureUrlHead ?? this.URI.origin;
        origin = origin.startsWith('https://') ? origin : 'https://' + origin;
        return pictureUrls.map(({ url }) => new Page(this, chapter, new URL(url, origin), { Referer: this.URI.href }));
    }
}