import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mgjinx',
        title: 'MGJINX'
    },
    container: {
        url: 'https://mgjinx.com/manga/41492-megumi-amano-is-full-of-openings',
        id: '/manga/41492-megumi-amano-is-full-of-openings',
        title: 'Megumi Amano Is Full of Openings!'
    },
    child: {
        id: '/manga/41492-megumi-amano-is-full-of-openings/chapter-1',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 505_616,
        type: 'image/webp'
    }
}).AssertWebsite();