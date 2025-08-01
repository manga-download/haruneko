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
        url: 'https://cycomi.com/title/147',
        id: '147',
        title: 'JACK FOX　キツネ男と鋼鉄の女'
    },
    child: {
        id: JSON.stringify({ id: 363, type: 2 }),
        title: '第１巻 - (1-10話)'
    },
    entry: {
        index: 0,
        size: 9_928,
        type: 'image/jpeg'
    }
}).AssertWebsite();