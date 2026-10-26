import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'syosetu',
        title: 'Syosetu'
    },
    container: {
        url: 'https://syosetu.cam/manga/どれが恋かがわからない-raw-free/',
        id: encodeURI('/manga/どれが恋かがわからない-raw-free/'),
        title: 'どれが恋かがわからない'
    },
    child: {
        id: encodeURI('/manga/どれが恋かがわからない-raw-free/chapter-16/').toLowerCase(),
        title: '【第16話】'
    },
    entry: {
        index: 0,
        size: 174_197,
        type: 'image/jpeg'
    }
}).AssertWebsite();