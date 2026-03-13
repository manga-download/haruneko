import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'yawarakaspirits',
        title: 'やわらかスピリッツ (Yawaraka Spirits)',
        timeout: 50000 //site is damn slow in browser
    },
    container: {
        url: 'https://yawaspi.com/gekirin/index.html',
        id: '/gekirin/index.html',
        title: 'GEKIRIN ～逆鱗～'
    },
    child: {
        id: '/gekirin/comic/001_001.html',
        title: '第1話'
    },
    entry: {
        index: 0,
        size: 136_715,
        type: 'image/jpeg'
    }
}).AssertWebsite();