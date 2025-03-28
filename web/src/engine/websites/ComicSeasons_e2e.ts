import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'comicseasons',
        title: 'Comic Seasons'
    },
    container: {
        url: 'https://comic-seasons.com/episode/2550912964824975207',
        id: '/episode/2550912964824975207',
        title: '甘い恋は星ふる夜に'
    },
    child: {
        id: '/episode/2550912964824975207',
        title: '第1話'
    },
    entry: {
        index: 0,
        size: 633_279,
        type: 'image/png'
    }
}).AssertWebsite();