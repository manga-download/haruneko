import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'syosetu',
        title: 'Syosetu'
    },
    container: {
        url: 'https://syosetu.ec/manga/どれが恋かがわからない-raw-free/',
        id: encodeURI('/manga/どれが恋かがわからない-raw-free/'),
        title: 'どれが恋かがわからない'
    },
    child: {
        id: encodeURI('/manga/どれが恋かがわからない-raw-free/chapter-17/').toLowerCase(),
        title: '【第17話】'
    },
    entry: {
        index: 2,
        size: 179_624,
        type: 'image/jpeg'
    }
}).AssertWebsite();