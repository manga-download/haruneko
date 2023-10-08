import type { BookmarkSerialized } from "../providers/BookmarkPlugin";

const legacyWebsiteIdentifierMap = {
    'heavenmanga': 'mytoon',
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

function GetKeys(data: unknown): string {
    return Object.keys(data).sort().join('|');
}

function IsSerializedBookmarkFormat(data: unknown): boolean {
    return GetKeys(data) === 'Created|Info|LastKnownEntries|Media|Title|Updated';
}

function IsLegacyBookmarkFormat(data: unknown): boolean {
    return GetKeys(data) === 'key|title';
}

export function ConvertToSerializedBookmark(data: unknown): BookmarkSerialized {
    if(IsSerializedBookmarkFormat(data)) {
        return data as BookmarkSerialized;
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
        const entry = data as BookmarkLegacy;
        bookmark.Media.ProviderID = legacyWebsiteIdentifierMap[entry.key.connector] ?? entry.key.connector;
        bookmark.Media.EntryID = entry.key.manga;
        bookmark.Title = entry.title.manga;
        return bookmark;
    }

    throw new Error();
}