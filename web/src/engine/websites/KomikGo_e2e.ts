import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'komikgo',
        title: 'KomikGo'
    },
    container: {
        url: 'https://komikgo.xyz/manga/15-minutes/',
        id: '/manga/15-minutes/',
        title: '15 Minutes'
    },
    child: {
        id: '/15-minutes-chapter-25/',
        title: 'Chapter 25'
    },
    entry: {
        index: 2,
        size: 43_399,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());