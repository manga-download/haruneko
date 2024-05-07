import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'nyrax',
        title: 'Nyrax'
    },
    container: {
        url: 'https://nyraxmanga.com/manga/my-little-wicked-girl/',
        id: '/manga/my-little-wicked-girl/',
        title: 'My Little Wicked Girl'
    },
    child: {
        id: '/my-little-wicked-girl-chapter-10/',
        title: 'Chapter 10'
    },
    entry: {
        index: 0,
        size: 2_443_941,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());