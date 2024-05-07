import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangatitan',
        title: 'Manga-Titan'
    },
    container: {
        url: 'https://manga-titans.com/manga/ultimate-soldier/',
        id: JSON.stringify({ post: '1485', slug: '/manga/ultimate-soldier/' }),
        title: 'ULTIMATE SOLDIER'
    },
    child: {
        id: '/manga/ultimate-soldier/%e0%b8%8b%e0%b8%b5%e0%b8%8b%e0%b8%b1%e0%b9%88%e0%b8%99-1/n-a/',
        title: '0'
    },
    entry: {
        index: 1,
        size: 157_364,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());