import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'bestmanhua',
        title: 'Best Manhua',
    },
    container: {
        url: 'https://bestmanhua.com/manga/all-hail-the-sect-leader/',
        id: JSON.stringify({ post: '5006', slug: '/manga/all-hail-the-sect-leader/' }),
        title: 'All Hail the Sect Leader'
    },
    child: {
        id: '/manga/all-hail-the-sect-leader/chapter-286/',
        title: 'Chapter 286'
    },
    entry: {
        index: 0,
        size: 767_841,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());