import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'harmonyscan',
        title: 'Harmony Scan'
    }, /* CloudFlare
    container: {
        url: 'https://harmony-scan.fr/manga/hyakuren-no-haou-to-seiyaku-no-ikusa-otome/',
        id: JSON.stringify({ post: '1909', slug: '/manga/hyakuren-no-haou-to-seiyaku-no-ikusa-otome/' }),
        title: 'Le maître du Ragnarok et la bénédiction des Einherjar'
    },
    child: {
        id: '/manga/hyakuren-no-haou-to-seiyaku-no-ikusa-otome/chapitre-12/',
        title: 'Chapitre 12 - Une sincérité toute simple…'
    },
    entry: {
        index: 0,
        size: 784_545,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());