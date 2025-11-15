import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ichijin-plus',
        title: '一迅プラス (Ichijin Plus)'
    },
    container: {
        url: 'https://ichicomi.com/episode/2550912965923203895',
        id: '/episode/2550912965923203895',
        title: '大室家'
    },
    child: {
        id: '/episode/2550912965923203895',
        title: '第1話'
    },
    entry: {
        index: 0,
        size: 1_170_104,
        type: 'image/png'
    }
}).AssertWebsite();