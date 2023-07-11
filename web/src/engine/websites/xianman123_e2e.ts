import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'xianman123',
        title: 'XianMan123'
    },
    container: {
        url: 'https://www.xianmanwang.com/bailianchengshen/',
        id: '/bailianchengshen/',
        title: '百炼成神',
    },
    child: {
        id: '/bailianchengshen/1859.html',
        title: '特别篇 神秘剑客',
    },
    entry: {
        index: 1,
        size: 526_910,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());