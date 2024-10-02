//import { AnnotationCategoryResourceKey as AC, AnnotationResourceKey as A } from '../i18n/ILocale';
//import { /*Store,*/ type StorageController } from './StorageController';
//import { Tag } from './Tags';
import type { MediaChecksum, MediaChild, MediaContainer } from './providers/MediaPlugin';

/*
// Use Case 01: Get annotations for specific media
const myMedia;
myMedia.Annotations // => list of all annotations
myMedia.Annotations.filter(a => a.Key === GlobalAnnotationKeys.Bookmark)

// Use Case 02: Get all media with specific annotations

*/

export class Annotation<K, V extends JSONElement> {

    constructor(private readonly foo: MediaChecksum, private readonly key: K | GlobalAnnotationKeys, private readonly value: V, private readonly unique: boolean = true) {}

    public get Checksum(): MediaChecksum {
        return null;
    }

    public get Value(): V {
        return this.value;
    }
}

// ++++++++++++++++++++++++++++++++

//const AnnotationKeys = Record<string, string>;

export enum GlobalAnnotationKeys {
    Bookmark = 'bookmark',
};

const enum FrontendAnnotationKeys {
    Viewed = 'frontend-classic-viewed',
};

const dbg = new Annotation<FrontendAnnotationKeys, string>(null, GlobalAnnotationKeys.Bookmark, '');
//type X = typeof BasicAnnotationKeys | typeof FrontendAnnotationKeys;
//let dbg: X = FrontendAnnotationKeys.Meow;
//dbg = BasicAnnotationKeys.Bookmark;
console.log(dbg.Value);

// ++++++++++++++++++++++++++++++++

class Annotations {
    private readonly annotations = new Map<string, JSONObject>();

    public Get<T extends JSONObject>(key: string): T {
        return this.annotations.get(key) as T;
    }

    public Set<T extends JSONObject>(key: string, value: T): void {
        this.annotations.set(key, value);
    }
}

export class AnnotationManager {

    private readonly annotationsByIdentifier: Map<string, Annotation<string, JSONObject>[]>;
    private readonly annotationsByTitle: Map<string, Annotation<string, JSONObject>[]>;
    private readonly annotations: Annotation<string, JSONObject>[];

    public GetAnnotations(media: MediaContainer<MediaChild>) {
        return this.annotations.filter(a => a.Checksum.Match(media.Checksum));
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