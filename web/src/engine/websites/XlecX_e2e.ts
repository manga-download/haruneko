import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'xlecx',
        title: 'XlecX'
    },
    container: {
        url: 'https://xlecx.one/32731-mayuyuus-laws.html',
        id: '/32731-mayuyuus-laws.html',
        title: 'Mayuyuu\'s Laws'
    },
    child: {
        id: '/32731-mayuyuus-laws.html',
        title: `Mayuyuu's Laws`
    },
    entry: {
        index: 0,
        size: 332_707,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());