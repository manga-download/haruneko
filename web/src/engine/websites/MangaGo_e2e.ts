import type { JSHandle } from 'puppeteer-core';
import { TestFixture } from '../../../test/WebsitesFixture';
import type { MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';

/**
 * A fixture with the ability to monkey-patch the manga identifier.
 * This enables testing of cross-domain hosted chapters.
 */
class PatchedFixture extends TestFixture<MangaPlugin, Manga, Chapter, Page<JSONObject>> {

    public MockMangaIdentifier(mangaID: string): PatchedFixture {
        this[ 'GetRemoteContainer' ] = (remotePlugin: JSHandle<MangaPlugin>, containerURL: string): Promise<JSHandle<Manga>> => {
            return remotePlugin.evaluateHandle(async (plugin: MangaPlugin, url: string, id: string) => {
                const container = await plugin.TryGetEntry(url) as Manga;
                Object.defineProperty(container, 'Identifier', { get() { return id; } });
                await container?.Update();
                return container;
            }, containerURL, mangaID);
        };
        return this;
    }
}

// CASE: Chapter hosted on 'mangago.me' with raw image
new TestFixture({
    plugin: {
        id: 'mangago',
        title: 'MangaGo'
    },
    container: {
        url: 'https://www.mangago.me/read-manga/the_dame_in_shining_armor/',
        id: '/read-manga/the_dame_in_shining_armor/',
        title: 'The Dame In Shining Armor',
    },
    child: {
        id: '/read-manga/the_dame_in_shining_armor/uu/to_chapter-10/pg-1/',
        title: 'Ch.10',
    },
    entry: {
        index: 47,
        size: 230_012,
        type: 'image/webp',
    }
}).AssertWebsite();

// CASE: Chapter hosted on 'mangago.me' with scrambled image
new TestFixture({
    plugin: {
        id: 'mangago',
        title: 'MangaGo'
    },
    container: undefined, // => TODO: Find manga/chapter with scrambled images ...
}).AssertWebsite();

// CASE: Chapter hosted on 'mangago.zone' with raw image
new PatchedFixture({
    plugin: {
        id: 'mangago',
        title: 'MangaGo'
    },
    container: {
        url: 'https://www.mangago.me/read-manga/the_dame_in_shining_armor/',
        id: 'https://www.mangago.zone/work/72005/',
        title: 'The Dame In Shining Armor',
    },
    child: {
        id: 'https://www.mangago.zone/chapter/72005/1708354/',
        title: 'Ch.10',
    },
    entry: {
        index: 47,
        size: 230_012,
        type: 'image/webp',
    }
}).MockMangaIdentifier('https://www.mangago.zone/work/72005/').AssertWebsite();

// CASE: Chapter hosted on 'youhim.me' with raw image
new PatchedFixture({
    plugin: {
        id: 'mangago',
        title: 'MangaGo'
    },
    container: {
        url: 'https://www.mangago.me/read-manga/the_dame_in_shining_armor/',
        id: 'https://www.youhim.me/work/72005/',
        title: 'The Dame In Shining Armor',
    },
    child: {
        id: 'https://www.youhim.me/chapter/72005/1708354/',
        title: 'Ch.10',
    },
    entry: {
        index: 47,
        size: 230_012,
        type: 'image/webp',
    }
}).MockMangaIdentifier('https://www.youhim.me/work/72005/').AssertWebsite();