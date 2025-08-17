import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'tibiu',
        title: 'Tibiu',
    },
    container: {
        url: 'https://comic.tibiu.net/comic/12674',
        id: '/comic/12674',
        title: '恋爱是件傻傻的事'
    },
    child: {
        id: '/chapter/12674/363100',
        title: '第1话'
    },
    entry: {
        index: 0,
        size: 211_586,
        type: 'image/webp'
    }
}).AssertWebsite();