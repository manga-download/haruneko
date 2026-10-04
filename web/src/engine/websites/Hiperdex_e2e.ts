import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'hiperdex',
        title: 'Hiperdex'
    },
    container: {
        url: 'https://hiperdex.tv/manga/b-chiku-26f76d6d',
        id: '8479/b-chiku-26f76d6d',
        title: 'B-Chiku'
    },
    child: {
        id: '7',
        title: '7'
    },
    entry: {
        index: 0,
        size: 183_996,
        type: 'image/webp'
    }
}).AssertWebsite();
