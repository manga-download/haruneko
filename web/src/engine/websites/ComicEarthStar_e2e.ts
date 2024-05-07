import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'comicearthstar',
        title: 'コミック アース・スター (Comic Earth Star)'
    },
    container: {
        url: 'https://comic-earthstar.com/episode/14079602755509005032',
        id: '/episode/14079602755509005032',
        title: '死に戻りのオールラウンダー　100回目の勇者パーティー追放で最強に至る'
    },
    child: {
        id: '/episode/14079602755509005032',
        title: '第1話'
    },
    entry: {
        index: 0,
        size: 1_997_933,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());