import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhuagold',
        title: 'Manhua Gold'
    },
    container: {
        url: 'https://manhuagold.top/manga/cultivator-against-hero-society',
        id: '/manga/cultivator-against-hero-society',
        title: 'Cultivator Against Hero Society'
    },
    child: {
        id: '/manga/cultivator-against-hero-society/chapter-302',
        title: 'Chapter 302'
    },
    entry: {
        index: 0,
        size: 869_273,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());