import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangarolls',
        title: 'MangaRolls'
    },
    container: {
        url: 'https://mangarolls.net/manga/foreigner-on-the-periphery-remake-2023/',
        id: JSON.stringify({ post: '6168', slug: '/manga/foreigner-on-the-periphery-remake-2023/' }),
        title: 'Foreigner on the Periphery (Remake)'
    },
    child: {
        id: '/manga/foreigner-on-the-periphery-remake-2023/chapter-0/',
        title: 'Chapter 0'
    },
    entry: {
        index: 0,
        size: 365_806,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());