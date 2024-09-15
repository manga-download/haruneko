﻿import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'dingmanhua',
        title: 'DingManhua'
    },
    container: {
        url: 'https://dingmanhua.com/comic/1091.html',
        id: '/comic/1091.html',
        title: '宿敌看我的眼神逐渐变质'
    },
    child: {
        id: '/chapter/1091-317356.html',
        title: '83 我的女朋友'
    },
    entry: {
        index: 2,
        size: 183_156,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());