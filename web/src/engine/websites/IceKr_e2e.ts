﻿import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'icekr',
        title: '冰氪漫画 (iceKr)'
    },
    container: {
        url: 'https://www.icekr.com/manhua/wojialaopolaiziyiqiannianqian/',
        id: '/manhua/wojialaopolaiziyiqiannianqian/',
        title: '我家老婆来自一千年前',
        timeout: 15000
    },
    child: {
        id: '/manhua/wojialaopolaiziyiqiannianqian/1387488.html',
        title: '预告',
        timeout: 15000
    },
    entry: {
        index: 0,
        size: 275_022,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());