import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'laimanhua8',
        title: 'Laimanhua8'
    },
    container: {
        url: 'https://www.laimanhua8.com/kanmanhua/jiandieguojiajia/',
        id: '/kanmanhua/jiandieguojiajia/',
        title: '间谍过家家'
    },
    child: {
        id: '/kanmanhua/jiandieguojiajia/30110070.html',
        title: '第70话 试看版'
    },
    entry: {
        index: 0,
        size: 255_291,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());