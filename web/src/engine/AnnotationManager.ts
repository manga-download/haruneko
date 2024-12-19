//import { AnnotationCategoryResourceKey as AC, AnnotationResourceKey as A } from '../i18n/ILocale';
import { Store, type StorageController } from './StorageController';
//import { Tag } from './Tags';
import type { MediaChecksum } from './providers/MediaPlugin';

/*
// Use Case 01: Get annotations for specific media
const myMedia;
myMedia.Annotations // => list of all annotations
myMedia.Annotations.filter(a => a.Key === GlobalAnnotationKeys.Bookmark)

// Use Case 02: Get all media with specific annotations

// Use Case 03: Use Annotations for Bookmarks

// Use Case 04: Use Annotations for (Download) Status

// Use Case 05: Use Annotations for Viewed Status
*/

export class Annotation<C extends string, V extends JSONElement> {
    constructor(public readonly Checksum: MediaChecksum, public readonly Category: C, public readonly Value: V) {}
}

// ++++++++++++++++++++++++++++++++

//const AnnotationKeys = Record<string, string>;

export enum GlobalAnnotationKeys {
    Bookmark = 'bookmark',
};

const enum FrontendAnnotationKeys {
    Viewed = 'frontend-classic-viewprogress',
};

const dbg = new Annotation<FrontendAnnotationKeys, string>(null, FrontendAnnotationKeys.Viewed, 'Meow!');
//type X = typeof BasicAnnotationKeys | typeof FrontendAnnotationKeys;
//let dbg: X = FrontendAnnotationKeys.Meow;
//dbg = BasicAnnotationKeys.Bookmark;
console.log('Annotation:', dbg.Value);

// ++++++++++++++++++++++++++++++++

export class AnnotationManager {

    private readonly lookupAnnotationsByMediaChecksum = new Map<string, Record<string, Annotation<string, JSONElement>>>();
    private readonly lookupAnnotationsByCategory = new Map<string, Record<string, Annotation<string, JSONElement>>>();

    constructor(private readonly storage: StorageController) {}

    public async Load() {
        const dbg = this.storage.LoadPersistent<>(Store.Annotations);
    }

    /*
    public GetAnnotations(media: MediaContainer<MediaChild>) {
        return this.annotations.filter(a => a.Checksum.Match(media.Checksum));
        //this.storage.LoadPersistent(Store.Annotations)
    }
    */

    public async Get<C extends string, V extends JSONElement>(checksum: MediaChecksum, category: C): Promise<V | undefined> {
        console.log('AnnotationManager::Get', checksum, category);
        return this.lookupAnnotationsByMediaChecksum.get(checksum.Identifier)?.[category]?.Value as V;
    }

    public async Set<C extends string, V extends JSONElement>(value: V, checksum: MediaChecksum, category: C): Promise<void> {
        console.log('AnnotationManager::Set', checksum, category, value);
        const annotation = new Annotation(checksum, category, value);
        await this.storage.SavePersistent(annotation.Value, Store.Annotations, checksum.Identifier);

        if(this.lookupAnnotationsByMediaChecksum.has(checksum.Identifier)) {
            this.lookupAnnotationsByMediaChecksum.get(checksum.Identifier)[category] = annotation;
        } else {
            this.lookupAnnotationsByMediaChecksum.set(checksum.Identifier, { [category]: annotation });
        }

        if(!this.lookupAnnotationsByCategory.has(category)) {
            this.lookupAnnotationsByCategory.get(category)[checksum.Identifier] = annotation;
        } else {
            this.lookupAnnotationsByCategory.set(category, { [checksum.Identifier]: annotation });
        }

        // TODO: Notify subscribers
    }

    public async Remove(checksum: MediaChecksum, category: string): Promise<void> {
        console.log('AnnotationManager::Remove', checksum, category);
        //const dbg = [];
        await this.storage.RemovePersistent(Store.Annotations, checksum.Identifier);
        // TODO: Remove from this.annotations
    }

    /*
    private readonly categories: AC[];
    private readonly annotationCategoryHashes = new Map<number, AC>();
    private readonly annotationHashes = new Map<number, A>();

    constructor(private readonly storage: StorageController, ...categories: AC[]) {
        this.categories = categories;
        let key: keyof (typeof AC & typeof A);
        for(key in AC) {
            this.annotationCategoryHashes.set(this.Hash(key), key as AC);
        }
        for(key in A) {
            this.annotationHashes.set(this.Hash(key), key as A);
        }
    }

    private SerializeTag(tag: Tag): TagSerialized {
        return {
            C: this.Hash(tag.Category),
            L: this.Hash(tag.Title),
            D: this.Hash(tag.Description),
        };
    }

    private DeserializeTags(tag: TagSerialized): Tag {
        return new Tag(this.annotationCategoryHashes.get(tag.C), this.annotationHashes.get(tag.L), this.annotationHashes.get(tag.D));
    }

    private SerializeEntry(entry: IMediaContainer): EntrySerialized {
        return {
            I: this.Hash(entry.Identifier),
            T: this.Hash(entry.Title),
            Tags: []
        };
    }

    private StorageKey(container: IMediaContainer): string {
        const parts: string[] = [];
        for(let current = container; current; current = current.Parent) {
            parts.unshift(current.Identifier);
        }
        return parts.join(' :: ');
    }
    */

    /**
     * Load the customized tags from persistent storage and apply them to the corresponding entries in the given {@link container}
     * @param container - The container with the entries to which the stored tags shall be applied
     */
    /*
    public async Load(container: IMediaContainer) {
        const serialized = await this.storage.LoadPersistent<EntrySerialized[]>(Store.TagManager, this.StorageKey(container)) ?? [];
        for(const entry of container.Entries as IMediaContainer[]) {
            const ih = this.Hash(entry.Identifier);
            const th = this.Hash(entry.Title);
            const foo = serialized.find(bar => bar.I === ih || bar.T === th);
            if(foo) {
                const dbg = foo.Tags.map(this.DeserializeTags);
            }
        }
    }
    */

    /**
     * Save the customized tags from the entries in the given {@link container} into persistent storage.
     * @param container - The container with the entries for which the tags shall be stored
     */
    /*
    public async Save(container: IMediaContainer) {
        const foo = container.Entries?.filter((entry: IMediaContainer) => entry.Tags.some(tag => this.categories.includes(tag.Category)));
        const bar = foo.map(this.SerializeEntry);
        await this.storage.SavePersistent(bar, Store.TagManager, this.StorageKey(container));
    }
    */
}