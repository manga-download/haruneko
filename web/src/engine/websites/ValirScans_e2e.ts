import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'valirscans',
        title: 'Valir Scans'
    },
    container: {
        url: 'https://valirscans.com/series/63d1d00732e/',
        id: '/series/63d1d00732e/',
        title: 'Growing the Seed of Evil'
    },
    child: {
        id: '/chapter/63d1d00732e-63daa67baa1/',
        title: 'Chapter 21'
    },
    entry: {
        index: 0,
        size: 952_842,
        type: 'image/jpeg'
    }
}).AssertWebsite();