import { describe, it, expect } from 'vitest';
import { PuppeteerFixture } from '../../../../test/PuppeteerFixture';

type ListingResult = {
    error?: string;
    count?: number;
};

async function ListMangas(pluginID: string): Promise<ListingResult> {
    const fixture = new PuppeteerFixture();
    const page = await fixture.GetPage();
    return page.evaluate(async (id: string): Promise<ListingResult> => {
        const plugin = window.HakuNeko.PluginController.WebsitePlugins.find(website => website.Identifier === id);
        if(!plugin) {
            return { error: `Website plugin not found: ${id}` };
        }
        try {
            await plugin.Update();
            return { count: plugin.Entries.Value.length };
        } catch(error) {
            return { error: String(error instanceof Error ? error.message : error) };
        }
    }, pluginID);
}

describe('Cloudflare-protected websites', () => {

    for(const pluginID of [ 'mangafire', 'comix', 'mangadrama' ]) {
        it(`should list mangas from '${pluginID}'`, { timeout: 240_000 }, async () => {
            const result = await ListMangas(pluginID);
            expect(result.error).toBeUndefined();
            expect(result.count).toBeGreaterThan(0);
        });
    }

    // Cloudflare never issues `cf_clearance` from flagged IPs, so the listing cannot complete.
    // Re-enable this case when running from a clean IP/VPN.
    it.skip(`should list mangas from 'crunchyscan'`, { timeout: 240_000 }, async () => {
        const result = await ListMangas('crunchyscan');
        expect(result.error).toBeUndefined();
        expect(result.count).toBeGreaterThan(0);
    });
});
