import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Chapter
new TestFixture({
    plugin: {
        id: 'cycomi',
        title: 'CyComi'
    },
    container: {
        url: 'https://cycomi.com/title/156',
        id: '156',
        title: 'あなたは私におとされたい'
    },
    child: {
        id: JSON.stringify({ id: 12036, type: 1 }),
        title: '第１話 - ジュウネンメノボクタチ'
    },
    entry: {
        index: 0,
        size: 219_613,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE: Volume
new TestFixture({
    plugin: {
        id: 'cycomi',
        title: 'CyComi'
    },
    container: {
        url: 'https://cycomi.com/title/193',
        id: '193',
        title: 'すきだから、だよ'
    },
    child: {
        id: JSON.stringify({ id: 635, type: 2 }),
        title: '第１巻 - (1-4話)'
    },
    entry: {
        index: 0,
        size: 212_406,
        type: 'image/jpeg'
    }
}).AssertWebsite();