import { describe, expect, it } from 'vitest';
import { PuppeteerFixture } from '../../../../test/PuppeteerFixture';
import type { Chapter, Manga, MangaPlugin, Page } from '../providers/MangaPlugin';
import type { Priority } from '../taskpool/DeferredTask';

type Config = {
    id: string;
    urls: [string, string, string];
};

export function AssertThaiReader(config: Config) {
    describe(`${config.id} end-to-end`, () => {
        it('loads the manga catalog', { timeout: 180_000 }, async () => {
            const app = await new PuppeteerFixture().GetPage();
            const count = await app.evaluate(async identifier => {
                const plugin = window.HakuNeko.PluginController.WebsitePlugins.find(website => website.Identifier === identifier) as MangaPlugin;
                await plugin.Initialize();
                await plugin.Update();
                return plugin.Entries.Value.length;
            }, config.id);
            expect(count).toBeGreaterThanOrEqual(3);
        });

        it('loads three manga and representative chapters', { timeout: 180_000 }, async () => {
            const app = await new PuppeteerFixture().GetPage();
            const result = await app.evaluate(async test => {
                const output = [];
                const plugin = window.HakuNeko.PluginController.WebsitePlugins.find(website => website.Identifier === test.id) as MangaPlugin;
                await plugin.Initialize();
                for (const url of test.urls) {
                    try {
                        const manga = await plugin.TryGetEntry(url) as Manga;
                        await manga.Update();
                        const chapters = manga.Entries.Value as Chapter[];
                        const indexes = [...new Set([0, Math.floor(chapters.length / 2), chapters.length - 1])];
                        const samples = [];
                        for (const index of indexes) {
                            const chapter = chapters[index];
                            await chapter.Update();
                            const pages = chapter.Entries.Value as Page[];
                            const blob = await pages[0]?.Fetch(4 as Priority, null);
                            samples.push({
                                index,
                                id: chapter.Identifier,
                                title: chapter.Title,
                                pages: pages.length,
                                blob: blob && { size: blob.size, type: blob.type }
                            });
                        }
                        output.push({ id: test.id, url, title: manga.Title, chapters: chapters.length, samples });
                    } catch (error) {
                        output.push({ id: test.id, url, error: error instanceof Error ? error.message : String(error) });
                    }
                }
                return output;
            }, config);
            console.log(`E2E=${JSON.stringify(result)}`);
            expect(result).toHaveLength(3);
            expect(result.every(item => !('error' in item) && item.chapters > 0 && item.samples.every(sample => sample.pages > 0 && sample.blob?.size > 0 && sample.blob.type.startsWith('image/')))).toBe(true);
        });
    });
}
