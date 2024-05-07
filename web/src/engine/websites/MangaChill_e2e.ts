import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangachill',
        title: 'MangaChill'
    },
    container: {
        url: 'https://toonchill.com/manga/i-ran-away-from-the-hunter/',
        id: JSON.stringify({ post: '124591', slug: '/manga/i-ran-away-from-the-hunter/' }),
        title: 'I Ran Away From the Hunter'
    },
    child: {
        id: '/manga/i-ran-away-from-the-hunter/chapter-0/',
        title: 'Chapter 0'
    },
    entry: {
        index: 0,
        size: 153_844,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());