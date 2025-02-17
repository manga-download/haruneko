﻿import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'comicdays',
        title: 'コミックDAYS (Comic Days)'
    },
    container: {
        url: 'https://comic-days.com/episode/14079602755285689668',
        id: '/episode/14079602755285689668',
        title: 'ＪＪＭ 女子柔道部物語 社会人編',
    },
    child: {
        id: '/episode/14079602755285689668',
        title: '第１話　かかぁ天下と空っ風'
    },
    entry: {
        index: 0,
        size: 2_259_808,
        type: 'image/png'
    }
}).AssertWebsite();