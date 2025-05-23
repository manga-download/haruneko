﻿import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ourfeel',
        title: 'OurFeel'
    },
    container: {
        url: 'https://ourfeel.jp/episode/2550689798581262904',
        id: '/episode/2550689798581262904',
        title: '私たちが恋する理由'
    },
    child: {
        id: '/episode/2550689798581262904',
        title: 'Reason.1'
    },
    entry: {
        index: 4,
        size: 1_699_678,
        type: 'image/png'
    }
}).AssertWebsite();