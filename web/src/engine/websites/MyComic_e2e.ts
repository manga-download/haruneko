import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mycomic',
        title: 'MyComic'
    },
    container: {
        url: 'https://mycomic.com/comics/8',
        id: '/comics/8',
        title: 'Angel Beats'
    },
    child: {
        id: '/chapters/143473',
        title: '特別篇4'
    },
    entry: {
        index: 0,
        size: 196_334,
        type: 'image/jpeg'
    }
}).AssertWebsite();