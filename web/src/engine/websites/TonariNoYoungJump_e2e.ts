import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'tonarinoyoungjump',
        title: 'となりのヤングジャンプ (Tonari no Young Jump)'
    },
    container: {
        url: 'https://tonarinoyj.jp/episode/14079602755248712266',
        id: '/episode/14079602755248712266',
        title: '俺だけ不遇スキルの異世界召喚叛逆記～最弱スキル【吸収】が全てを飲み込むまで～'
    },
    child: {
        id: '/episode/316112896809499266',
        title: '[第1話]'
    },
    entry: {
        index: 0,
        size: 1_465_859,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());