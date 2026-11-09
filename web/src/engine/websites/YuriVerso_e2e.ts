import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture ({
    plugin: {
        id: 'yuriverso',
        title: 'Yuri On Air'
    },
    container: {
        url: 'https://yurionair.top/manga/life-is-strange-dust/',
        id: JSON.stringify({ post: '3032', slug: '/manga/life-is-strange-dust/' }),
        title: 'Life is Strange -Dust-'
    },
    child: {
        id: '/manga/life-is-strange-dust/capitulo-01/',
        title: 'Capítulo #01'
    },
    entry: {
        index: 0,
        size: 838_042,
        type: 'image/jpeg'
    }
}).AssertWebsite();