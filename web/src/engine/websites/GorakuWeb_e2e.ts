import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'gorakuweb',
        title: 'Goraku Web'
    },
    container: {
        url: 'https://gorakuweb.com/episode/2182584535145566737',
        id: '/episode/2182584535145566737',
        title: 'うれしょん！'
    },
    child: {
        id: '/episode/2182584535145566737/2252269624984173610',
        title: '第1話　ムッツリスケベ'
    },
    entry: {
        index: 0,
        size: 116_256,
        type: 'image/webp'
    }
}).AssertWebsite();