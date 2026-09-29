import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mistscans',
        title: 'Mist Scans'
    },
    container: {
        url: 'https://mistscans.com/series/blue-night-guesthouse-2/',
        id: '/series/blue-night-guesthouse-2/',
        title: 'Blue Night Guesthouse'
    },
    child: {
        id: '/chapter/65bc6715db8-65bc79a3ba5/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 399_241,
        type: 'image/avif'
    }
}).AssertWebsite();