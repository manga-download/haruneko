import type { BookmarkSerialized } from "../providers/BookmarkPlugin";

export function ConvertToSerializedBookmark(data: unknown): BookmarkSerialized {
    if(IsSerializedBookmarkFormat(data)) {
        return data as BookmarkSerialized;
    }

    const bookmark = {
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

    if(IsHakuNekoLegacyFormat(data)) {
        return bookmark;
    }

    throw new Error();
}

function IsSerializedBookmarkFormat(data: unknown): boolean {
    return data && true;
}

function IsHakuNekoLegacyFormat(data: unknown): boolean {
    return data && false;
}