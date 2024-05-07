import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'comictrail',
        title: 'Comic Trail (コミックトレイル)'
    },
    container: {
        url: 'https://comic-trail.com/episode/14079602755223488078',
        id: '/episode/14079602755223488078',
        title: '異世界召喚おじさんの銃無双ライフ 〜サバゲー好きサラリーマンは会社終わりに異世界へ直帰する〜'
    },
    child: {
        id: '/episode/14079602755173408823',
        title: 'TRIGGER．26　ダイスケvs.ゾル'
    },
    entry: {
        index: 0,
        size: 1_801_347,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());