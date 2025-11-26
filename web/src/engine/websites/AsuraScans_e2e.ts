import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'asurascans',
        title: 'Asura Scans',
    },
    container: {
        url: 'https://asuracomic.net/series/nano-machine-8f82311f',
        id: '/series/nano-machine-',
        title: 'Nano Machine',
    },
    child: {
        id: '/series/nano-machine-/chapter/270',
        title: 'Chapter 270 90. Lightning Qi <2>',
    },
    entry: {
        index: 1,
        size: 1_030_468,
        type: 'image/webp'
    }
}).AssertWebsite();