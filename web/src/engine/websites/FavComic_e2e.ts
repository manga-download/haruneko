import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'favcomic',
        title: 'FavComic'
    },
    container: {
        url: 'https://www.favcomic.com/comic/detail/1137479166120304640',
        id: '/comic/detail/1137479166120304640',
        title: '梦的话让我醒来吧'
    },
    child: {
        id: '/comic/chapter/1138667554236145664',
        title: '第01話'
    },
    entry: {
        index: 0,
        size: 70_300,
        type: 'image/webp'
    }
}).AssertWebsite();