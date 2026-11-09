import { TestFixture } from '../../../test/WebsitesFixture';

// CASE : non scrambled
new TestFixture({
    plugin: {
        id: 'niceoppai',
        title: 'NiceOppai'
    },
    container: {
        url: 'https://www.niceoppai.net/A-Golden-Palace-in-the-Last-Days/',
        id: '/A-Golden-Palace-in-the-Last-Days/',
        title: 'A Golden Palace in the Last Days'
    },
    child: {
        id: '/A-Golden-Palace-in-the-Last-Days/86/',
        title: '86',
        timeout: 15_000
    },
    entry: {
        index: 1,
        size: 207_885,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE : scrambled
new TestFixture({
    plugin: {
        id: 'niceoppai',
        title: 'NiceOppai'
    },
    container: {
        url: 'https://www.niceoppai.net/op/',
        id: '/op/',
        title: 'One Piece'
    },
    child: {
        id: '/op/1191/',
        title: '1191 โลกิอยู่ที่นี่'
    },
    entry: {
        index: 3,
        size: 1_478_876,
        type: 'image/png'
    }
}).AssertWebsite();