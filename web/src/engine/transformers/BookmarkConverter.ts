import { VariantResourceKey as R } from '../../i18n/ILocale';
import { Exception } from '../Error';
import type { BookmarkSerialized } from '../providers/Bookmark';

const legacyWebsiteIdentifierMap = {
    '9anime': 'aniwave',
    'aresnov': 'scarmanga',
    'azoramanga': 'azoraworld',
    'apolltoons': 'mundomanhwa',
    'bacamangaorg': 'bacamanga',
    'bananascan': 'harmonyscan',
    'blogtruyen': 'blogtruyenmoi', //there is also a blogtruyen now, same website template
    'cocomanhua': 'colamanga',
    'comicbushi': 'comicgrowl',
    'comicwalker': 'kadocomi',
    'crazyscans': 'mangacultivator',
    'dalsei': 'viyafansub',
    'evascans': 'manwe',
    'firescans': 'firecomics',
    'firstkiss': 'likemanga',
    'flamescans-org': 'flamecomics',
    'galaxyaction': 'galaxymanga',
    'gateanimemanga': 'gatemanga',
    'imperioscans': 'neroxus',
    'kisscomic': 'readcomiconline',
    'komikav': 'apkomik',
    'kumascans': 'retsu',
    'lyrascans': 'quantumscans', //https://www.mangaupdates.com/groups.html?id=35005683580 'Formerly known as LyraScans'
    'mangamx': 'mangaoni',
    'manganel': 'manganato',
    'manganelos': 'mangapure',
    'mangaproz': 'mangapro',
    'mangaraw': 'mangageko',
    'manhuaes': 'manhuaaz',
    'manhuascan': 'kaliscan',
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
    'rightdarkscan': 'darkscan',
    'scansmangasxyz': 'scansmangasme',
    'scanhentaimenu': 'xmanga',
    'secretscans': 'lynxscans',
    'shonenmagazine-pocket': 'shonenmagazine',
    'siyahmelek': 'grimelek',
    'smangavfws': 'smangavf',
    'suryatoon': 'genztoon',
    'sushiscanfr': 'animesama',
    'truemanga': 'mangamonk',
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