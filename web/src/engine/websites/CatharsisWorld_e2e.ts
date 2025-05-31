import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'catharsisworld',
        title: 'Catharsis World'
    },
    container: {
        url: 'https://catharsisworld.justep.me/serie/mision-romance-sincero/',
        id: '/serie/mision-romance-sincero/',
        title: 'Misión: Romance Sincero'
    },
    child: {
        id: '/serie/mision-romance-sincero/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 524_514,
        type: 'image/webp'
    }
}).AssertWebsite();