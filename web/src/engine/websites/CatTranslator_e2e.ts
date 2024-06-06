import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'cat-translator',
        title: 'Cat-Translator'
    },
    // Geo-blocked (Region: Thailand)
    /*
    container: {
        url: 'https://cats-translator.com/manga/manga/sky-sword-god/',
        id: JSON.stringify({ post: '6294', slug: '/manga/manga/sky-sword-god/' }),
        title: 'Sky Sword God'
    },
    child: {
        id: encodeURI('/manga/manga/sky-sword-god/ซีซั่น/ตอนที่-1/').toLowerCase(),
        title: 'ตอนที่ 1'
    },
    entry: {
        index: 0,
        size: 28_664,
        type: 'image/jpeg'
    }
    */
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());