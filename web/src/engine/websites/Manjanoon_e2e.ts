import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manjanoon',
        title: 'Manjanoon'
    },
    container: {
        url: 'https://manjanoon.co/manga/nn-holding-you-captive/',
        id: '/manga/nn-holding-you-captive/',
        title: 'Holding You Captive'
    },
    child: {
        id: '/nn-holding-you-captive-%d8%a7%d9%84%d9%81%d8%b5%d9%84-22/',
        title: 'الفصل 22'
    },
    entry: {
        index: 0,
        size: 1_244_612,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());