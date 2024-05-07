import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'xianman123',
        title: 'XianMan123'
    },
    container: {
        url: 'https://www.gaonaojin.com/douluodaluIIjueshitangmen/',
        id: '/douluodaluIIjueshitangmen/',
        title: '斗罗大陆 II 绝世唐门',
    },
    child: {
        id: '/douluodaluIIjueshitangmen/376.html',
        title: '369 强敌！',
    },
    entry: {
        index: 1,
        size: 254_668,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());