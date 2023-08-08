import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhuagui',
        title: '看漫画 (ManHuaGui)',
    },
    container: {
        url: 'https://www.manhuagui.com/comic/7580/',
        id: '/comic/7580/',
        title: '一拳超人',
        timeout : 30000
    },
    child: {
        id: '/comic/7580/705774.html',
        title: '第234话',
        timeout: 30000

    },
    entry: {
        index: 0,
        size: 170_704,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());