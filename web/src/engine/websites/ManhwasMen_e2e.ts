import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'manhwasmen',
        title: 'Manhwas Men'
    },
    /* CloudFlare
    container: {
        url: 'https://manhwas.men/manga/caffeine-raw',
        id: '/manga/caffeine-raw',
        title: 'Caffeine'
    },
    child: {
        id: '/manga/caffeine-raw/61.00',
        title: 'Chapter 61.00',
    },
    entry: {
        index: 0,
        size: 3_672_990,
        type: 'image/jpeg'
    }
    */
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());