import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
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
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());