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
        size: 531_180,
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
        title: '第1巻 (¥0)'
    },
    entry: {
        index: 0,
        size: 1_012_662,
        type: 'image/png'
    } */
}).AssertWebsite();