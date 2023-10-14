import { GetLocale } from '../../i18n/Localization';
import type { BookmarkSerialized } from '../providers/Bookmark';

const legacyWebsiteIdentifierMap = {
    'bananascan': 'harmonyscan',
    'heavenmanga': 'beetoon', // (future zbulu PR)
    'heavenmanga2': 'heavenmanga', // (future zbulu PR)
    'mangaswat': 'goldragon',
    'muctau': 'bibimanga',
    'secretscans': 'lynxscans',
    'shonenmagazine-pocket': 'shonenmagazine',
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

class BookmarkFormatError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = BookmarkFormatError.name;
    }
}

function GetKeys(data: unknown, prefix = ''): string {
    return Object.keys(data ?? {}).map(key => {
        const value = data[key];
        const isObject = typeof value === 'object' && !Array.isArray(value) && value !== null;
        return isObject ? GetKeys(value, key + '.') : prefix + key;
    }).sort().join(', ');
}

function IsSerializedBookmarkFormat(data: unknown): data is BookmarkSerialized {
    return GetKeys(data) === 'Created, Info.EntryID, Info.ProviderID, LastKnownEntries.IdentifierHashes, LastKnownEntries.TitleHashes, Media.EntryID, Media.ProviderID, Title, Updated';
}

function IsLegacyBookmarkFormat(data: unknown): data is BookmarkLegacy {
    return GetKeys(data) === 'key.connector, key.manga, title.connector, title.manga';
}

export function ConvertToSerializedBookmark(data: unknown): BookmarkSerialized {
    if(IsSerializedBookmarkFormat(data)) {
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
        },
        LastKnownEntries: {
            IdentifierHashes: [],
            TitleHashes: [],
        }
    };

    if(IsLegacyBookmarkFormat(data)) {
        bookmark.Media.ProviderID = legacyWebsiteIdentifierMap[data.key.connector] ?? data.key.connector;
        bookmark.Media.EntryID = data.key.manga;
        bookmark.Title = data.title.manga;
        return bookmark;
    }

    throw new BookmarkFormatError(GetLocale().BookmarkPlugin_ConvertToSerializedBookmark_UnsupportedFormatError());
}