import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'cmangax',
        title: 'CMangax'
    },
    container: {
        url: 'https://cmangax10.com/album/trong-sinh-chi-quan-chu-80929',
        id: '80929',
        title: 'Trọng Sinh Chi Quân Chủ'
    },
    child: {
        id: '2198086',
        title: 'Chapter 11'
    },
    entry: {
        index: 2,
        size: 32_766,
        type: 'image/webp'
    }
}).AssertWebsite();