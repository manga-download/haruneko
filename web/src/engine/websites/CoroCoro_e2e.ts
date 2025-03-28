﻿import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'corocoro',
        title: 'CoroCoro Online (コロコロオンライン)'
    },
    container: {
        url: 'https://www.corocoro.jp/title/29',
        id: '29',
        title: '勝利の女神：NIKKE すいーとえんかうんと'
    },
    child: {
        id: '4934',
        title: '第1話'
    },
    entry: {
        index: 0,
        size: 169_646,
        type: 'image/webp'
    },
}).AssertWebsite();