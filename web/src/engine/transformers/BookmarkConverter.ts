import { VariantResourceKey as R } from '../../i18n/ILocale';
import { Exception } from '../Error';
import type { BookmarkSerialized } from '../providers/Bookmark';

const legacyWebsiteIdentifierMap = {
    '9anime': 'aniwave',
    'azoramanga': 'azoraworld',
    'apolltoons': 'mundomanhwa',
    'bacamangaorg': 'bacamanga',
    'bananascan': 'harmonyscan',
    'comicbushi': 'comicgrowl',
    'crazyscans': 'mangacultivator',
    'dalsei': 'viyafansub',
    'evascans': 'manwe',
    'firstkiss': 'likemanga',
    'flamescans-org': 'flamecomics',
    'gateanimemanga': 'gatemanga',
    'heavenmanga': 'beetoon', // (future zbulu PR)
    'heavenmanga2': 'heavenmanga', // (future zbulu PR)
    'kisscomic': 'readcomiconline',
    'kumascans': 'retsu',
    'lovehug': 'welovemanga',
    'lyrascans': 'quantumscans', //https://www.mangaupdates.com/groups.html?id=35005683580 'Formerly known as LyraScans'
    'mangamx': 'mangaoni',
    'manganel': 'manganato',
    'manganelos': 'mangapure',
    'mangaproz': 'mangapro',
    'mangaraw': 'mangagecko',
    'mangaswat': 'goldragon',
    'manhuaes': 'manhuaaz',
    'manhwaclub': 'manhwahentai',
    'muctau': 'bibimanga',
    'nitroscans': 'nitromanga',
    'nonbiri': 'comic21',
    'oxapk': 'manjanoon',
    'ozulscans': 'kingofmanga',
    'prismascans': 'demonsect',
    'randomscan': 'luratoon',
    'realmscans': 'rizzcomics',
    'reaperscansid': 'shinigamiid',
    'scansmangasxyz': 'scansmangasme',
    'secretscans': 'lynxscans',
    'shonenmagazine-pocket': 'shonenmagazine',
    'smangavfws': 'smangavf',
    'sushiscanfr': 'animesama',
    'vermanhwas': 'vermanhwa',
    'webtoontrcom': 'webtoontrnet',
    'yugenmangas': 'yugenmangas-es'
};

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
        bookmark.Media.ProviderID = legacyWebsiteIdentifierMap[data.key.connector] ?? data.key.connector;
        bookmark.Media.EntryID = data.key.manga;
        bookmark.Title = data.title.manga;
        return bookmark;
    }

    throw new BookmarkFormatError(R.BookmarkPlugin_ConvertToSerializedBookmark_UnsupportedFormatError);
}