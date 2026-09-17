import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'novelcool-en',
        title: 'Novel Cool (English)'
    },
    container: {
        url: 'https://www.novelcool.com/novel/ONE-PIECE.html',
        id: '/novel/ONE-PIECE.html',
        title: 'ONE PIECE',
    },
    /* chapter urk is random
    child: {
        id: '',
        title: 'Vol.TBE Ch.1192',
    },
    entry: {
        index: 1,
        size: 93_704,
        type: 'image/webp'
    }*/
}).AssertWebsite();