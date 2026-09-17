import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'hotcomics',
        title: 'HotComics'
    },
    container: {
        url: 'https://w1.hotcomics.me/jp/unquenchable-thirst/V1aiwbI5.html',
        id: '/jp/unquenchable-thirst/V1aiwbI5.html',
        title: 'Unquenchable Thirst [jp]'
    },
    child: {
        id: '/en/unquenchable-thirst/episode-1-OjPmORio.html',
        title: '1'
    },
    entry: {
        index: 0,
        size: 12_961,
        type: 'image/jpeg'
    }
}).AssertWebsite();