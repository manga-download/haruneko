import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'asurascans',
        title: 'Asura Scans',
    },
    container: {
        url: 'https://asurascans.com/comics/nano-machine-7f873ca6',
        id: '/comics/nano-machine',
        title: 'Nano Machine',
    },
    child: {
        id: '/comics/nano-machine/chapter/270',
        title: 'Chapter 270 90. Lightning Qi <2>',
    },
    entry: {
        index: 1,
        size: 1_540_252,
        type: 'image/webp'
    }
}).AssertWebsite();