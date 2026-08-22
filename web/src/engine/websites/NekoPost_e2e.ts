import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'nekopost',
        title: 'NekoPost',
    },
    container: {
        url: 'https://www.nekopost.net/manga/17834',
        id: '/manga/17834',
        title: 'ลากมา เ ก ที่บ้านซะเลย'
    },
    child: {
        id: '/manga/17834/0',
        title: 'Ch.0 - One-Shot'
    },
    entry: {
        index: 0,
        size: 487_282,
        type: 'image/jpeg'
    }
}).AssertWebsite();
