import { type IMediaChild, type IMediaContainer, MediaContainer } from './MediaPlugin';
import { Event } from '../Event';
import type { IMediaInfoTracker } from '../trackers/IMediaInfoTracker';
import icon from '../../img/warning.webp';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';

/**
 * A dummy representation for a bookmark's origin (media title), which is no longer available.
 */
class MissingWebsiteEntry extends MediaContainer<IMediaContainer> {
    constructor(identifier: string, title: string) {
        super(identifier, title, null);
    }
    public override get Icon(): string {
        return icon;
    }
    public override async Update(): Promise<void> {
        throw new Exception(R.Plugin_MissingWebsiteEntry_UpdateError);
    }
}

/**
 * A dummy representation for a bookmark's parent (website), which has been removed.
 */
export class MissingWebsite extends MediaContainer<IMediaContainer> {
    constructor(identifier: string) {
        super(identifier, identifier, null);
    }
    public override get Icon(): string {
        return icon;
    }
    public override CreateEntry(identifier: string, title: string): IMediaContainer {
        return new MissingWebsiteEntry(identifier, title);
    }
    public override async Update(): Promise<void> {
        throw new Exception(R.Plugin_MissingWebsite_UpdateError);
    }
}

/**
 * A bookmark is more or less a proxy/facade for a media container.
 */
export class Bookmark extends MediaContainer<IMediaChild> {

    public readonly Changed: Event<typeof this, void> = new Event<typeof this, void>();

    constructor(
        public readonly Created: Date,
        public Updated: Date,
        parent: IMediaContainer,
        MediaID: string,
        title: string,
        private tracker?: IMediaInfoTracker,
        private infoID?: string
    ) {
        super(MediaID, title, parent);
    }

    private Hash(text: string): string {
        return text.split('').reduce((hash, c) => 31 * hash + c.charCodeAt(0) | 0, 0).toString(36);
    }

    public get StorageKey(): string {
        return `${this.Parent.Identifier} :: ${this.Identifier}`;
    }

    private origin: IMediaContainer;
    /**
     * Get the origin entry related to this bookmark from the shared parent.
     * If the origin entry does not yet exist, a stand in origin entry will be used.
     */
    private get Origin(): IMediaContainer {
        const entry = (this.Parent.Entries as IMediaContainer[]).find(entry => entry.Identifier === this.Identifier) ?? this.origin;
        if(entry) {
            return entry;
        } else {
            this.origin = this.Parent.CreateEntry(this.Identifier, this.Title) as IMediaContainer;
            return this.origin;
        }
    }

    /**
     * Directly pass-through the icon from the media container.
     */
    public override get Icon(): string {
        return this.Origin?.Icon ?? super.Icon;
    }

    /**
     * Directly pass-through the entries from the shared parent.
     */
    public override get Entries(): IMediaContainer[] {
        return this.Origin.Entries as IMediaContainer[];
    }

    public get Tracker(): IMediaInfoTracker {
        return this.tracker ?? null;
    }

    public get InfoID(): string | null {
        return this.infoID ?? null;
    }

    public get IsOrphaned(): boolean {
        return this.Parent instanceof MissingWebsite;
    }

    /**
     * Update the entries of the origin related to this bookmark.
     */
    public async Update(): Promise<void> {
        await this.Origin.Update();
    }

    /**
     * Memorize the current list of entries as list of last known entries,
     * so future requests with {@link GetNewEntries} will be based on these known entries.
     */
    public async ApplyEntriesAsKnownEntries(): Promise<void> {
        const entries = this.Entries;
        if(entries.length > 0) {
            this.Updated = new Date();
            this.Changed.Dispatch(this);
        } else {
            // TODO: No entries available, maybe website is broken or entries not yet updated?
        }
    }

    public LinkTracker(tracker: IMediaInfoTracker, infoID: string) {
        this.Updated = new Date();
        this.tracker = tracker;
        this.infoID = infoID;
        this.Changed.Dispatch(this);
    }
}

export type BookmarkSerialized = {
    Created: number,
    Updated: number,
    Title: string,
    Media: Provider,
    Info: Provider,
};

type Provider = {
    ProviderID?: string,
    EntryID?: string
}