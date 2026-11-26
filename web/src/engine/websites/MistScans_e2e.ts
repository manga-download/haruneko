import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mistscans',
        title: 'Mist Scans'
    },
    container: {
        url: 'https://mistscans.org/blue-night-guesthouse-2',
        id: '/blue-night-guesthouse-2/',
        title: 'Blue Night Guesthouse'
    },
    child: {
        id: '/blue-night-guesthouse-2-chapter-1',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 399_241,
        type: 'image/avif'
    }
}).AssertWebsite();