import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'lumoskomik',
        title: 'LumosKomik'
    },
    container: {
        url: 'https://03.lumosgg.com/comic/the-tales-of-heaven-and-earth',
        id: '/comic/the-tales-of-heaven-and-earth',
        title: 'The Tales of Heaven And Earth'
    },
    child: {
        id: '/read/the-tales-of-heaven-and-earth/chapter-6',
        title: 'Chapter 6'
    },
    entry: {
        index: 0,
        size: 204_896,
        type: 'image/webp'
    }
}).AssertWebsite();