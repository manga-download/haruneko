import { TestFixture } from '../../../test/WebsitesFixture';

//Case using fetchScriptedImages
new TestFixture({
    plugin: {
        id: 'mangahere',
        title: 'MangaHere'
    },
    container: {
        url: 'https://www.mangahere.cc/manga/darwin_s_game/',
        id: '/manga/darwin_s_game/',
        title: `Darwin's Game`
    },
    child: {
        id: '/manga/darwin_s_game/c001/1.html',
        title: 'Ch.001'
    },
    entry: {
        index: 0,
        size: 186_010,
        type: 'image/jpeg'
    }
}).AssertWebsite();

//Case with newImgs + missing protocol in images urls
new TestFixture({
    plugin: {
        id: 'mangahere',
        title: 'MangaHere'
    },
    container: {
        url: 'https://www.mangahere.cc/manga/the_lazy_prince_becomes_a_genius/',
        id: '/manga/the_lazy_prince_becomes_a_genius/',
        title: 'The Lazy Prince Becomes a Genius'
    },
    child: {
        id: '/manga/the_lazy_prince_becomes_a_genius/c001/1.html',
        title: 'Ch.001'
    },
    entry: {
        index: 0,
        size: 194_388,
        type: 'image/jpeg'
    }
}).AssertWebsite();
