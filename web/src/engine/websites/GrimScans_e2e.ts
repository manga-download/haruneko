import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'grimscans',
        title: 'Grim Scans'
    },
    container: {
        url: 'https://grimscans.com/series/639aa326e55/',
        id: '/series/639aa326e55/',
        title: 'Your Sponsorship Means A Lot'
    },
    child: {
        id: '/chapter/639aa326e55-639ac49c48a/',
        title: 'Chapter 17'
    },
    entry: {
        index: 1,
        size: 191_060,
        type: 'image/jpeg'
    }
}).AssertWebsite();