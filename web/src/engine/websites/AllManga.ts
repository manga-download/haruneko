import { Tags } from '../Tags';
import icon from './AllManga.webp';
import { Delay } from '../BackgroundTimers';
import { FetchGraphQL, FetchWindowScript } from '../platform/FetchProvider';
import { GetBase64FromBytes, GetBytesFromBase64, GetBytesFromHex, GetBytesFromUTF8, GetHexFromBytes, GetUTF8FromBytes } from '../BufferEncoder';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { SHA256 } from '../Crypto';

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

type CryptoParams = {
    epoch: number;
    epocjMS: number;
    graceMS: number;
    partB: string;
    switchAt: number;
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
        const { epoch, partB } = await FetchWindowScript<CryptoParams>(new Request(chapterURL), 'window.__aaCrypto', 1500);

        const pagesQuery = `
            query(
                $mangaId: String!
                        $translationType: VaildTranslationTypeMangaEnumType!
                        $chapterString: String!
                        $limit: Int!
                        $offset: Int
            ) {
                chapterPages(
                    mangaId: $mangaId
                            translationType: $translationType
                            chapterString: $chapterString
                            limit: $limit
                            offset: $offset
                ) {
                    edges {
                        pictureUrlHead
                        pictureUrls
                    }
                    manga {
                        _id
                        countryOfOrigin
                    }
                }
            }
        `;

        const sha256Hash = GetHexFromBytes(new Uint8Array(await SHA256(pagesQuery)));
        const aaReq = await this.GenerateSignature(partB, epoch, sha256Hash);
        const { tobeparsed: encrypted } = await FetchGraphQL<{ tobeparsed: string; }>(new Request(this.apiURL), '', pagesQuery, {
            ...<ChapterID>JSON.parse(chapter.Identifier),
            mangaId: chapter.Parent.Identifier,
            limit: 999,
            offset: 0,
        }, {
            persistedQuery: {
                version: 1, sha256Hash, aaReq
            }
        });
        const { chapterPages: { edges: [{ pictureUrlHead, pictureUrls }] } } = await this.Decrypt<APIPages>(encrypted);
        let origin = pictureUrlHead ?? this.URI.origin;
        origin = origin.startsWith('https://') ? origin : 'https://' + origin;
        return pictureUrls.map(({ url }) => new Page(this, chapter, new URL(url, origin), { Referer: this.URI.href }));
    }

    private async GenerateSignature(partB: string, epoch: number, queryHash: string): Promise<string> {
        const BUILD_ID = '20';
        //derive key
        const xorKey = GetBytesFromHex('78ebe40583e4f360cd9f56926b775a780054367c826123dcd0577a231eee4e73');
        const keyData = GetBytesFromBase64(partB);
        const rawKey = new Uint8Array(32);
        for (let i = 0; i < 32; i++) {
            rawKey[i] = keyData[i] ^ xorKey[i % xorKey.length];
        }

        const key = await crypto.subtle.importKey('raw', rawKey, { name: 'AES-GCM' }, false, ['encrypt']);
        const ts = Math.floor(Date.now() / 300_000) * 300_000;
        const iv = (await SHA256(`${epoch}:${BUILD_ID}:${queryHash}:${ts}`)).slice(0, 12);

        const payload = JSON.stringify({
            v: 1,
            ts,
            epoch,
            buildId: BUILD_ID,
            qh: queryHash,
        });

        const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv, tagLength: 128 }, key, GetBytesFromUTF8(payload)));
        const out = new Uint8Array(13 + ciphertext.length);
        out[0] = 1;
        out.set(new Uint8Array(iv), 1);
        out.set(ciphertext, 13);
        return GetBase64FromBytes(out);
    }

    private async Decrypt<T>(data: string): Promise<T> {
        const message = GetBytesFromBase64(data);
        const ciphertext = message.slice(13, message.length - 16);
        const tag = message.slice(message.length - 16);
        const algorithm = { name: 'AES-GCM', iv: message.slice(1, 13) };
        const key = await crypto.subtle.importKey('raw', await SHA256('Xot36i3lK3:v1'), algorithm, false, ['decrypt']);
        const result = await crypto.subtle.decrypt(algorithm, key, new Uint8Array([...ciphertext, ...tag]));
        return JSON.parse(GetUTF8FromBytes(result)) as T;
    }
}