import { VariantResourceKey as R } from '../../i18n/ILocale';
import { Exception } from '../Error';
import type { BookmarkSerialized } from '../providers/Bookmark';

/**
 * __DO NOT USE!__
 * @remarks Only exported for testing
 */
export const legacyWebsiteIdentifierMap = new Map([
    [ 'aresnov', 'scarmanga' ],
    [ 'azoramanga', 'azoraworld' ],
    [ 'apolltoons', 'mundomanhwa' ],
    [ 'bacamangaorg', 'bacamanga' ],
    [ 'bananascan', 'harmonyscan' ],
    [ 'blogtruyen', 'blogtruyenmoi' ],
    [ 'cocomanhua', 'colamanga' ],
    [ 'comicbushi', 'comicgrowl' ],
    [ 'comicwalker', 'kadocomi' ],
    [ 'dalsei', 'viyafansub' ],
    [ 'evascans', 'manwe' ],
    [ 'firescans', 'firecomics' ],
    [ 'firstkiss', 'likemanga' ],
    [ 'flamescans-org', 'flamecomics' ],
    [ 'galaxyaction', 'galaxymanga' ],
    [ 'gateanimemanga', 'gatemanga' ],
    [ 'imperioscans', 'neroxus' ],
    [ 'instamanhwa', 'xmanhwa' ],
    [ 'kisscomic', 'readcomiconline' ],
    [ 'komikav', 'apkomik' ],
    [ 'kumascans', 'retsu' ],
    [ 'lyrascans', 'quantumscans' ],
    [ 'mangamx', 'mangaoni' ],
    [ 'manganel', 'manganato' ],
    [ 'mangaproz', 'mangapro' ],
    [ 'mangaraw', 'mangageko' ],
    [ 'mangatale', 'ikiru' ],
    [ 'manhuaes', 'manhuaaz' ],
    [ 'manhuascan', 'kaliscan' ],
    [ 'manhwaclub', 'manhwahentai' ],
    [ 'nitroscans', 'nitromanga' ],
    [ 'nonbiri', 'comic21' ],
    [ 'oxapk', 'manjanoon' ],
    [ 'ozulscans', 'kingofmanga' ],
    [ 'prismascans', 'demonsect' ],
    [ 'realmscans', 'rizzcomics' ],
    [ 'reaperscansid', 'shinigamiid' ],
    [ 'scanhentaimenu', 'xmanga' ],
    [ 'secretscans', 'lynxscans' ],
    [ 'shonenmagazine-pocket', 'shonenmagazine' ],
    [ 'siyahmelek', 'grimelek' ],
    [ 'suryatoon', 'genztoon' ],
    [ 'sushiscanfr', 'animesama' ],
    [ 'vermanhwas', 'vermanhwa' ],
    [ 'visualikigai', 'ikigaimangas' ],
    [ 'webtoontrcom', 'webtoontrnet' ],
]);

type BookmarkLegacy = {
    title: {
        connector: string;
        manga: string;
    };
    key: {
        connector: string;
        manga: string;
    };
};

class BookmarkFormatError extends Exception { }

function GetKeys(data: unknown, prefix = ''): string {
    return Object.keys(data ?? {}).map(key => {
        const value = data[key];
        const isObject = typeof value === 'object' && !Array.isArray(value) && value !== null;
        return isObject ? GetKeys(value, key + '.') : prefix + key;
    }).sort().join(', ');
}

function IsSerializedBookmarkFormat(data: unknown): data is BookmarkSerialized {
    return GetKeys(data) === 'Created, Info.EntryID, Info.ProviderID, Media.EntryID, Media.ProviderID, Title, Updated';
}

function IsLegacyBookmarkFormat(data: unknown): data is BookmarkLegacy {
    return GetKeys(data) === 'key.connector, key.manga, title.connector, title.manga';
}

export function ConvertToSerializedBookmark(data: unknown): BookmarkSerialized {
    if (IsSerializedBookmarkFormat(data)) {
        return data;
    }

    const bookmark: BookmarkSerialized = {
        Created: 0,
        Updated: 0,
        Title: '',
        Media: {
            ProviderID: '',
            EntryID: '',
        },
        Info: {
            ProviderID: null,
            EntryID: null,
        }
    };

    if (IsLegacyBookmarkFormat(data)) {
        bookmark.Media.ProviderID = legacyWebsiteIdentifierMap.has(data.key.connector) ? legacyWebsiteIdentifierMap.get(data.key.connector) : data.key.connector;
        bookmark.Media.EntryID = data.key.manga;
        bookmark.Title = data.title.manga;
        return bookmark;
    }

    throw new BookmarkFormatError(R.BookmarkPlugin_ConvertToSerializedBookmark_UnsupportedFormatError);
}