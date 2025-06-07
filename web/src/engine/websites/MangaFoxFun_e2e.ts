import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangafoxfun',
        title: 'MangaFoxFun',
    },
    container: {
        url: 'https://mangafox.fun/manga/aishiteru-uso-dakedo',
        id: 'aishiteru-uso-dakedo',
        title: '"aishiteru", Uso Dakedo.'
    },
    child: {
        id: '1',
        title: 'Ch.1 - Vol.1 chapter 1'
    },
    entry: {
        index: 3,
        size: 176_361,
        type: 'image/jpeg'
    }
}).AssertWebsite();