import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'cmangax',
        title: 'CMangax'
    },
    container: {
        url: 'https://cmangax16.com/album/trong-sinh-chi-quan-chu-80929',
        id: JSON.stringify({ id: '80929', slug: 'trong-sinh-chi-quan-chu' }),
        title: 'Trọng Sinh Chi Quân Chủ'
    },
    child: {
        id: JSON.stringify({ id: '2198086', num: '11' }),
        title: 'Chapter 11'
    },
    entry: {
        index: 2,
        size: 32_766,
        type: 'image/webp'
    }
}).AssertWebsite();