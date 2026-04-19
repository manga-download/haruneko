import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Provided in Chapters
new TestFixture({
    plugin: {
        id: 'piccoma',
        title: 'Piccoma'
    }, /* Region Locked
    container: {
        url: 'https://piccoma.com/web/product/6301',
        id: '6301',
        title: 'エロスの種子'
    },
    child: {
        id: '1106510',
        title: '第一話 (1)'
    },
    entry: {
        index: 0,
        size: 603_257,
        type: 'image/png'
    } */
}).AssertWebsite();

// CASE: Provided in Volumes
new TestFixture({
    plugin: {
        id: 'piccoma',
        title: 'Piccoma'
    }, /* Region Locked
    container: {
        url: 'https://piccoma.com/web/product/6301',
        id: '6301',
        title: 'エロスの種子'
    },
    child: {
        id: '367170',
        title: '1',
        timeout: 60_000 // need to load all pictures, could take a while
    },
    entry: {
        index: 0,
        size: 1_091_700,
        type: 'image/png'
    } */
}).AssertWebsite();