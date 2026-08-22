import { describe, expect, it } from 'vitest';
import { PuppeteerFixture } from '../../../../test/PuppeteerFixture';
import { TestFixture } from '../../../test/WebsitesFixture';
import type { Chapter, Manga, MangaPlugin } from '../providers/MangaPlugin';

const config = {
    plugin: {
        id: 'niceoppai',
        title: 'NiceOppai'
    },
    container: {
        url: 'https://www.niceoppai.net/A-Golden-Palace-in-the-Last-Days/',
        id: '/A-Golden-Palace-in-the-Last-Days/',
        title: 'A Golden Palace in the Last Days'
    },
    child: {
        id: '/A-Golden-Palace-in-the-Last-Days/86/',
        title: '86'
    },
    entry: {
        index: 1,
        size: 207_885,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();

describe('NiceOppai › shuffled 2 x 5 image tiles', () => {
    it('Should restore and fetch the protected sample image', { timeout: 25_000 }, async () => {
        const fixture = new PuppeteerFixture();
        const page = await fixture.GetPage();
        const result = await page.evaluate(async () => {
            const plugin = window.HakuNeko.PluginController.WebsitePlugins.find(website => website.Identifier === 'niceoppai') as MangaPlugin;
            await plugin.Initialize();
            const manga = await plugin.TryGetEntry('https://www.niceoppai.net/Drawing-Saikyou-Mangaka-Wa-Oekaki-Skill-De-Isekai-Musou-Suru/') as Manga;
            await manga.Update();
            const chapter = manga.Entries.Value.find(entry => entry.Identifier === '/Drawing-Saikyou-Mangaka-Wa-Oekaki-Skill-De-Isekai-Musou-Suru/190/') as Chapter;
            await chapter.Update();
            const pageCount = chapter.Entries.Value.length;
            const protectedPageCount = chapter.Entries.Value.filter(entry => (entry.Parameters?.pieces as JSONArray)?.length).length;

            const imagePage = chapter.Entries.Value.find(entry => entry.Link.pathname.includes('N203SUlUWGJ2UktpMWJ3ZmVDckk5aVpJYzhaL253MmxrRVJqdVpSdmhHVT0')) as unknown as {
                Fetch(priority: number, signal: AbortSignal): Promise<Blob>
            };

            const blob = await imagePage.Fetch(0, null);
            const bitmap = await createImageBitmap(blob);
            const dimensions = { width: bitmap.width, height: bitmap.height };
            bitmap.close();
            return { type: blob.type, size: blob.size, pageCount, protectedPageCount, ...dimensions };
        });

        expect({ type: result.type, size: result.size, width: result.width, height: result.height }).toEqual({
            type: 'image/png',
            size: 1_424_849,
            width: 1000,
            height: 1472
        });
        expect([result.pageCount, result.protectedPageCount]).toEqual([19, 6]);
    });
});
