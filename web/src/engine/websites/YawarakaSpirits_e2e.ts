import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'yawarakaspirits',
        title: 'やわらかスピリッツ (Yawaraka Spirits)',
        timeout: 50000 //again site is damn slow in browser
    },
    container: {
        url: 'https://yawaspi.com/gekirin/index.html',
        id: '/gekirin/index.html',
        title: 'GEKIRIN　～逆鱗～'
    },
    child: {
        id: '/gekirin/comic/004_001.html',
        title: '第4話'
    },
    entry: {
        index: 0,
        size: 126_165,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());