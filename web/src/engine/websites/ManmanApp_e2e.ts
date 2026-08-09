import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manmanapp',
        title: 'Manman Comic 漫漫漫画'
    },
    container: {
        url: 'https://www.manmanapp.com/comic-1404679.html',
        id: '/comic-1404679.html',
        title: '星武神诀'
    },
    child: {
        id: '/comic/detail-1474643.html',
        title: '第1话'
    },
    entry: {
        index: 0,
        size: 98_035,
        type: 'image/jpeg'
    }
}).AssertWebsite();