﻿import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'comictrail',
        title: 'Comic Trail (コミックトレイル)'
    },
    container: {
        url: 'https://comic-trail.com/episode/3270375685395233042',
        id: '/episode/3270375685395233042',
        title: '異世界召喚おじさんの銃無双ライフ 〜サバゲー好きサラリーマンは会社終わりに異世界へ直帰する〜'
    },
    child: {
        id: '/episode/3270375685395233042',
        title: 'TRIGGER．1　異世界と銃'
    },
    entry: {
        index: 4,
        size: 1_770_223,
        type: 'image/png'
    }
}).AssertWebsite();